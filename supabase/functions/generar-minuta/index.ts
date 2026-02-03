import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerarMinutaRequest {
  titulo_reunion: string;
  fecha_reunion: string;
  hora_inicio: string;
  hora_fin?: string;
  lugar: string;
  moderador: string;
  tipo_documento: string;
  participantes: string;
  archivos?: Array<{ nombre: string; contenido?: string }>;
  usuario_nombre?: string;
  usuario_cargo?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuario no autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestData: GenerarMinutaRequest = await req.json();

    if (!requestData.titulo_reunion || !requestData.fecha_reunion || !requestData.lugar) {
      return new Response(
        JSON.stringify({ error: "Campos requeridos: titulo_reunion, fecha_reunion, lugar" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "API key de OpenAI no configurada" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const participantesLista = requestData.participantes.split(',').map(p => p.trim());

    let referenciaArchivos = '';
    if (requestData.archivos && requestData.archivos.length > 0) {
      const textosArchivos = requestData.archivos
        .filter(a => a.contenido)
        .map(a => `Contenido de ${a.nombre}:\n${a.contenido.substring(0, 1000)}`)
        .join('\n\n');

      if (textosArchivos) {
        referenciaArchivos = `\n\nDocumentos de referencia subidos:\n${textosArchivos}`;
      }
    }

    const systemPrompt = `Eres un asistente especializado en la elaboración de minutas, actas y memorias de reuniones para el ámbito municipal guatemalteco. Tu función es generar documentos profesionales, completos y bien estructurados que cumplan con los estándares institucionales.

ESTRUCTURA PARA ${requestData.tipo_documento.toUpperCase()}:

1. ENCABEZADO
   - Institución: Municipalidad de Guatemala
   - Departamento: Departamento Jurídico
   - Tipo de documento: ${requestData.tipo_documento}
   - Título del evento/reunión
   - Fecha, hora y lugar

2. ASISTENTES
   - Lista completa de participantes con sus cargos (si se conocen)
   - Indicar quién preside o modera

3. ORDEN DEL DÍA / AGENDA
   - Puntos tratados en orden de importancia
   - Temas discutidos

4. DESARROLLO DE LA REUNIÓN
   - Para cada punto del orden del día:
     * Presentación del tema
     * Discusión y argumentos principales
     * Intervenciones relevantes
     * Decisiones o conclusiones

5. ACUERDOS Y COMPROMISOS
   - Lista numerada de acuerdos alcanzados
   - Responsables de cada acuerdo
   - Plazos de cumplimiento

6. ASUNTOS VARIOS (si aplica)
   - Temas adicionales no programados

7. CONVOCATORIA PRÓXIMA REUNIÓN (si aplica)
   - Fecha tentativa
   - Temas pendientes

8. CIERRE
   - Hora de finalización
   - Firmas de conformidad

FORMATO:
- Usa lenguaje formal y profesional
- Redacción en tercera persona
- Tiempo verbal: pasado para descripciones, presente para acuerdos
- Numeración clara para acuerdos y compromisos
- Párrafos bien estructurados

IMPORTANTE:
- Si hay documentos de referencia, incorpóralos en el contexto adecuado
- Genera contenido completo y detallado
- Incluye espacios para firmas al final
- Usa nomenclatura oficial guatemalteca`;

    const userPrompt = `Genera un/a ${requestData.tipo_documento} con la siguiente información:

DATOS DE LA REUNIÓN:
- Título: ${requestData.titulo_reunion}
- Fecha: ${requestData.fecha_reunion}
- Hora de inicio: ${requestData.hora_inicio}
${requestData.hora_fin ? `- Hora de finalización: ${requestData.hora_fin}` : ''}
- Lugar: ${requestData.lugar}
- Moderador/Presidente: ${requestData.moderador}

PARTICIPANTES:
${participantesLista.map((p, i) => `${i + 1}. ${p}`).join('\n')}
${referenciaArchivos}

Genera un documento completo, profesional y detallado. Incluye orden del día relevante basado en el título y contexto, desarrollo de la reunión con discusiones coherentes, y acuerdos específicos y medibles.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("Error de OpenAI:", errorData);
      return new Response(
        JSON.stringify({
          error: "Error al comunicarse con OpenAI",
          details: errorData
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const documento = openaiData.choices[0]?.message?.content || "No se pudo generar el documento";

    const firmaFinal = requestData.usuario_nombre
      ? `\n\n---\n${requestData.usuario_nombre}\n${requestData.usuario_cargo || 'Departamento Jurídico'}\nMunicipalidad de Guatemala`
      : '';

    const documentoFinal = documento + firmaFinal;
    const duracion = Date.now() - startTime;

    const { data: docData, error: docError } = await supabase
      .from('documentos')
      .insert({
        usuario_id: user.id,
        tipo_documento: 'minuta',
        titulo: requestData.titulo_reunion,
        contenido: documentoFinal,
        metadata: {
          tipo: requestData.tipo_documento,
          fecha_reunion: requestData.fecha_reunion,
          lugar: requestData.lugar,
          participantes: participantesLista,
          modelo: "gpt-4o"
        }
      })
      .select()
      .single();

    if (docError) {
      console.error("Error guardando documento:", docError);
    }

    const tokens = openaiData.usage?.total_tokens || 0;
    const costoEstimado = (openaiData.usage?.prompt_tokens || 0) * 0.0000025 +
                          (openaiData.usage?.completion_tokens || 0) * 0.00001;

    const { error: transError } = await supabase
      .from('transacciones_api')
      .insert({
        usuario_id: user.id,
        documento_id: docData?.id,
        agente: 'generar-minuta',
        modelo: 'gpt-4o',
        tokens_entrada: openaiData.usage?.prompt_tokens || 0,
        tokens_salida: openaiData.usage?.completion_tokens || 0,
        tokens_total: tokens,
        costo: costoEstimado,
        duracion: duracion,
        estado: 'exitoso'
      });

    if (transError) {
      console.error("Error registrando transacción:", transError);
    }

    return new Response(
      JSON.stringify({
        documento: documentoFinal,
        documento_id: docData?.id,
        guardado: !docError,
        metadata: {
          tipo: requestData.tipo_documento,
          titulo: requestData.titulo_reunion,
          fecha: requestData.fecha_reunion,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o",
          tokens: tokens,
          costo_usd: costoEstimado.toFixed(6),
          duracion_ms: duracion
        }
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error en generación de minuta:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : "Error desconocido"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
