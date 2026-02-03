import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerarResumenExpedienteRequest {
  numero_expediente: string;
  tipo_caso: string;
  demandante?: string;
  demandado?: string;
  fecha_inicio?: string;
  estado?: string;
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

    const requestData: GenerarResumenExpedienteRequest = await req.json();

    if (!requestData.numero_expediente || !requestData.tipo_caso) {
      return new Response(
        JSON.stringify({ error: "Campos requeridos: numero_expediente, tipo_caso" }),
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

    let referenciaDocumentos = '';
    if (requestData.archivos && requestData.archivos.length > 0) {
      const textosArchivos = requestData.archivos
        .filter(a => a.contenido)
        .map(a => `--- ${a.nombre} ---\n${a.contenido}`)
        .join('\n\n');

      if (textosArchivos) {
        referenciaDocumentos = `\n\nDOCUMENTOS DEL EXPEDIENTE:\n${textosArchivos}`;
      }
    }

    const systemPrompt = `Eres un experto analista jurídico especializado en derecho municipal guatemalteco. Tu función es generar resúmenes ejecutivos claros, precisos y completos de expedientes legales.

ESTRUCTURA DEL RESUMEN EJECUTIVO:

1. DATOS GENERALES DEL EXPEDIENTE
   - Número de expediente
   - Tipo de caso
   - Fecha de inicio
   - Estado actual
   - Partes involucradas (demandante/demandado)

2. ANTECEDENTES Y HECHOS RELEVANTES
   - Narración cronológica de los hechos
   - Contexto del conflicto o situación jurídica
   - Eventos clave en el desarrollo del caso

3. MARCO JURÍDICO APLICABLE
   - Leyes, decretos y normativas relevantes
   - Artículos específicos aplicables
   - Jurisprudencia relacionada (si aplica)

4. ANÁLISIS LEGAL
   - Pretensiones de las partes
   - Fundamentos legales de cada posición
   - Pruebas presentadas y su valoración
   - Procedimientos aplicados

5. ACTUACIONES PROCESALES PRINCIPALES
   - Escritos presentados
   - Audiencias realizadas
   - Resoluciones emitidas
   - Diligencias practicadas

6. VALORACIÓN DE LA SITUACIÓN JURÍDICA
   - Fortalezas y debilidades del caso
   - Riesgos jurídicos identificados
   - Precedentes aplicables

7. SITUACIÓN ACTUAL DEL EXPEDIENTE
   - Estado procesal
   - Plazos pendientes
   - Actuaciones próximas

8. CONCLUSIONES Y RECOMENDACIONES
   - Resumen de hallazgos principales
   - Estrategia jurídica sugerida
   - Acciones recomendadas

FORMATO:
- Lenguaje técnico-jurídico pero comprensible
- Citas precisas de artículos y leyes
- Análisis objetivo e imparcial
- Conclusiones claras y fundamentadas

IMPORTANTE:
- Si hay documentos del expediente, analízalos exhaustivamente
- Identifica todos los elementos jurídicos relevantes
- Mantén objetividad en el análisis
- Destaca riesgos y oportunidades`;

    const userPrompt = `Genera un resumen ejecutivo completo para el siguiente expediente:

INFORMACIÓN DEL EXPEDIENTE:
- Número de expediente: ${requestData.numero_expediente}
- Tipo de caso: ${requestData.tipo_caso}
${requestData.demandante ? `- Demandante/Solicitante: ${requestData.demandante}` : ''}
${requestData.demandado ? `- Demandado/Requerido: ${requestData.demandado}` : ''}
${requestData.fecha_inicio ? `- Fecha de inicio: ${requestData.fecha_inicio}` : ''}
${requestData.estado ? `- Estado: ${requestData.estado}` : ''}
${referenciaDocumentos}

Genera un análisis jurídico completo, detallado y profesional que permita comprender rápidamente el expediente y tomar decisiones informadas.`;

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
        temperature: 0.3,
        max_tokens: 4000,
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
    const resumen = openaiData.choices[0]?.message?.content || "No se pudo generar el resumen";

    const firmaFinal = requestData.usuario_nombre
      ? `\n\n---\nElaborado por: ${requestData.usuario_nombre}\n${requestData.usuario_cargo || 'Departamento Jurídico'}\nMunicipalidad de Guatemala`
      : '';

    const resumenFinal = resumen + firmaFinal;
    const duracion = Date.now() - startTime;

    const { data: docData, error: docError } = await supabase
      .from('documentos')
      .insert({
        usuario_id: user.id,
        tipo_documento: 'resumen_expediente',
        titulo: `Resumen Expediente ${requestData.numero_expediente}`,
        contenido: resumenFinal,
        metadata: {
          numero_expediente: requestData.numero_expediente,
          tipo_caso: requestData.tipo_caso,
          demandante: requestData.demandante,
          demandado: requestData.demandado,
          fecha_inicio: requestData.fecha_inicio,
          estado: requestData.estado,
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
        agente: 'generar-resumen-expediente',
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
        resumen: resumenFinal,
        documento_id: docData?.id,
        guardado: !docError,
        metadata: {
          expediente: requestData.numero_expediente,
          tipo_caso: requestData.tipo_caso,
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
    console.error("Error en generación de resumen:", error);
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
