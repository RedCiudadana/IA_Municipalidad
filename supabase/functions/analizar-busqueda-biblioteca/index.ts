import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalisisBusquedaRequest {
  consulta: string;
  tipo_documento?: string;
  categoria?: string;
}

interface DocumentoSugerido {
  id: string;
  titulo: string;
  numero_documento: string;
  resumen_ejecutivo: string;
  relevancia: number;
  tipo_documento: string;
  categoria: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: AnalisisBusquedaRequest = await req.json();

    if (!requestData.consulta) {
      return new Response(
        JSON.stringify({ error: "El campo 'consulta' es requerido" }),
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!openaiApiKey || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Configuración del servidor incompleta" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: categorias } = await supabase
      .from('categorias_juridicas')
      .select('nombre');

    const { data: tiposDocumento } = await supabase
      .from('tipos_documento_juridico')
      .select('nombre');

    const categoriasDisponibles = categorias?.map(c => c.nombre).join(', ') || '';
    const tiposDisponibles = tiposDocumento?.map(t => t.nombre).join(', ') || '';

    const systemPrompt = `Eres un asistente especializado en análisis de consultas jurídicas municipales. Tu función es analizar la búsqueda del usuario y sugerir:
1. Categorías jurídicas relevantes
2. Tipos de documentos que podrían ser útiles
3. Palabras clave relacionadas
4. Temas jurídicos conectados

CATEGORÍAS DISPONIBLES:
${categoriasDisponibles}

TIPOS DE DOCUMENTO DISPONIBLES:
${tiposDisponibles}

Debes responder en formato JSON con la siguiente estructura:
{
  "analisis": "Breve análisis de la consulta (2-3 líneas)",
  "categorias_sugeridas": ["categoría1", "categoría2"],
  "tipos_documento_sugeridos": ["tipo1", "tipo2"],
  "palabras_clave": ["palabra1", "palabra2", "palabra3"],
  "temas_relacionados": ["tema1", "tema2"],
  "sugerencia_busqueda": "Texto mejorado para la búsqueda"
}

IMPORTANTE:
- Usa SOLO categorías y tipos de documento de las listas proporcionadas
- Genera palabras clave específicas del derecho municipal guatemalteco
- Sé preciso y relevante`;

    const userPrompt = `Analiza esta consulta del usuario: "${requestData.consulta}"
${requestData.tipo_documento ? `\nTipo de documento filtrado: ${requestData.tipo_documento}` : ''}
${requestData.categoria ? `\nCategoría filtrada: ${requestData.categoria}` : ''}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
        max_tokens: 1000,
        response_format: { type: "json_object" }
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
    const analisisTexto = openaiData.choices[0]?.message?.content || "{}";
    const analisis = JSON.parse(analisisTexto);

    let query = supabase
      .from('documentos_juridicos')
      .select(`
        id,
        titulo,
        numero_documento,
        resumen_ejecutivo,
        relevancia,
        tipo_documento:tipos_documento_juridico(nombre),
        categoria:categorias_juridicas(nombre)
      `)
      .eq('vigente', true)
      .order('relevancia', { ascending: false })
      .limit(5);

    if (analisis.palabras_clave && analisis.palabras_clave.length > 0) {
      const palabrasClave = analisis.palabras_clave.slice(0, 3);
      const searchPattern = `%${palabrasClave.join('%')}%`;
      query = query.or(`titulo.ilike.${searchPattern},resumen_ejecutivo.ilike.${searchPattern}`);
    }

    const { data: documentosSugeridos } = await query;

    return new Response(
      JSON.stringify({
        analisis: analisis.analisis || "Análisis de la consulta",
        categorias_sugeridas: analisis.categorias_sugeridas || [],
        tipos_documento_sugeridos: analisis.tipos_documento_sugeridos || [],
        palabras_clave: analisis.palabras_clave || [],
        temas_relacionados: analisis.temas_relacionados || [],
        sugerencia_busqueda: analisis.sugerencia_busqueda || requestData.consulta,
        documentos_sugeridos: documentosSugeridos || [],
        metadata: {
          consulta_original: requestData.consulta,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o-mini"
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
    console.error("Error en análisis de búsqueda:", error);
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
