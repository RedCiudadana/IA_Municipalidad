import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BusquedaNormativaRequest {
  tema: string;
  contexto?: string;
  tipo_normativa?: string;
  ambito?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: BusquedaNormativaRequest = await req.json();

    if (!requestData.tema) {
      return new Response(
        JSON.stringify({ error: "El campo 'tema' es requerido" }),
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

    const systemPrompt = `Eres un experto en derecho municipal guatemalteco, especializado en búsqueda y análisis de normativa legal. Tu función es localizar, analizar y explicar la normativa aplicable relacionada con consultas jurídicas municipales.

NORMATIVA PRINCIPAL A CONSIDERAR:
1. Constitución Política de la República de Guatemala
2. Código Municipal (Decreto 12-2002)
3. Ley de Servicio Municipal (Decreto 1-87)
4. Ley de Contrataciones del Estado (Decreto 57-92)
5. Ley Orgánica del Presupuesto (Decreto 101-97)
6. Ley de Probidad y Responsabilidades de Funcionarios Públicos (Decreto 89-2002)
7. Ley General de Descentralización (Decreto 14-2002)
8. Ordenanzas municipales vigentes

ESTRUCTURA DE TU RESPUESTA:

1. RESUMEN EJECUTIVO
   - Breve descripción del tema consultado
   - Normativa principal aplicable identificada

2. ANÁLISIS NORMATIVO DETALLADO
   - Para cada norma identificada:
     * Nombre completo y número de decreto/ordenanza
     * Artículos específicos aplicables
     * Cita textual de los artículos relevantes
     * Interpretación y alcance de la norma

3. JERARQUÍA NORMATIVA
   - Orden de prelación de las normas aplicables
   - Relación entre las diferentes normas identificadas

4. PRECEDENTES Y JURISPRUDENCIA
   - Criterios jurisprudenciales relevantes (si aplica)
   - Dictámenes de la Procuraduría General de la Nación relacionados

5. APLICACIÓN PRÁCTICA
   - Cómo aplicar la normativa al caso consultado
   - Pasos o procedimientos establecidos en la ley
   - Requisitos legales a cumplir

6. RECOMENDACIONES JURÍDICAS
   - Sugerencias de actuación conforme a derecho
   - Advertencias sobre posibles conflictos normativos
   - Aspectos que requieren atención especial

IMPORTANTE:
- Cita siempre el artículo específico, decreto y fecha
- Si una norma fue derogada o modificada, indícalo claramente
- Distingue entre normas obligatorias y supletorias
- Menciona plazos legales cuando sean relevantes
- Si hay vacíos legales, indícalo y sugiere normas supletorias
- Usa lenguaje jurídico formal pero comprensible`;

    const userPrompt = `TEMA DE CONSULTA: ${requestData.tema}

${requestData.contexto ? `CONTEXTO ADICIONAL: ${requestData.contexto}` : ''}

${requestData.tipo_normativa ? `TIPO DE NORMATIVA PRIORITARIA: ${requestData.tipo_normativa}` : ''}

${requestData.ambito ? `ÁMBITO DE APLICACIÓN: ${requestData.ambito}` : ''}

Por favor, proporciona un análisis exhaustivo de la normativa aplicable a esta consulta.`;

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
    const resultado = openaiData.choices[0]?.message?.content || "No se pudo generar el análisis";

    return new Response(
      JSON.stringify({
        resultado,
        metadata: {
          tema: requestData.tema,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o"
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
    console.error("Error en búsqueda de normativa:", error);
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
