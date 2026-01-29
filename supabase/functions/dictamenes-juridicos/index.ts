import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DictamenRequest {
  asunto: string;
  antecedentes: string;
  solicitante?: string;
  cargo_solicitante?: string;
  departamento?: string;
  normativa_sugerida?: string;
  pregunta_juridica?: string;
  documentos_adjuntos?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: DictamenRequest = await req.json();

    if (!requestData.asunto || !requestData.antecedentes) {
      return new Response(
        JSON.stringify({ error: "Los campos 'asunto' y 'antecedentes' son requeridos" }),
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

    const systemPrompt = `Eres un abogado senior especializado en derecho municipal guatemalteco, con experiencia en la elaboración de dictámenes jurídicos para gobiernos municipales. Tu función es elaborar dictámenes jurídicos completos, estructurados y fundamentados en derecho.

COMPETENCIAS ESPECIALIZADAS:
- Derecho Municipal (Código Municipal - Decreto 12-2002)
- Derecho Administrativo
- Contrataciones del Estado (Decreto 57-92)
- Derecho Constitucional
- Procedimientos Administrativos
- Probidad y Responsabilidades de Funcionarios Públicos
- Derecho Financiero Municipal

ESTRUCTURA OBLIGATORIA DEL DICTAMEN:

I. ENCABEZADO
   - DICTAMEN JURÍDICO No. [Sugerir formato]
   - FECHA: [Fecha actual]
   - PARA: [Destinatario]
   - DE: Departamento Jurídico Municipal
   - ASUNTO: [Asunto del dictamen]

II. ANTECEDENTES
   Describe los hechos relevantes del caso de manera cronológica y objetiva.
   - Presenta los hechos conocidos
   - Identifica las partes involucradas
   - Señala documentación existente
   - Establece el contexto administrativo

III. PLANTEAMIENTO DE LA CUESTIÓN JURÍDICA
   Formula claramente las preguntas jurídicas que deben resolverse.
   - Define con precisión el problema jurídico
   - Identifica los puntos controvertidos
   - Delimita el alcance del análisis

IV. NORMATIVA APLICABLE
   Identifica y cita toda la normativa relevante:
   - Constitución Política de Guatemala (artículos específicos)
   - Código Municipal (artículos específicos con texto completo)
   - Leyes ordinarias aplicables (con número de decreto y artículos)
   - Reglamentos municipales (si aplica)
   - Ordenanzas municipales vigentes (si aplica)

   FORMATO: Para cada norma cita:
   * Nombre completo de la ley y número de decreto
   * Artículo específico
   * Texto literal del artículo (entre comillas)
   * Interpretación del artículo

V. ANÁLISIS JURÍDICO
   Desarrolla un análisis fundamentado y estructurado:

   A. Análisis Normativo
      - Interpreta las normas aplicables al caso concreto
      - Establece la jerarquía normativa
      - Identifica principios jurídicos aplicables

   B. Precedentes y Jurisprudencia
      - Cita jurisprudencia de la Corte de Constitucionalidad (si aplica)
      - Referencias a dictámenes de la Procuraduría General de la Nación
      - Criterios de la Contraloría General de Cuentas (si aplica)

   C. Doctrina Legal
      - Principios del derecho administrativo
      - Principios del derecho municipal
      - Doctrina legal guatemalteca relevante

   D. Argumentación Jurídica
      - Desarrolla razonamiento lógico-jurídico
      - Analiza pros y contras de diferentes interpretaciones
      - Sustenta la posición jurídica adoptada

VI. CONCLUSIONES
   Presenta conclusiones claras y numeradas:
   - Responde directamente a las cuestiones planteadas
   - Resume los hallazgos principales del análisis
   - Establece la posición jurídica definitiva
   - Número cada conclusión (PRIMERA, SEGUNDA, etc.)

VII. RECOMENDACIONES
   Sugiere acciones concretas basadas en el análisis:
   - Propone cursos de acción legalmente viables
   - Señala riesgos jurídicos a considerar
   - Indica procedimientos a seguir
   - Sugiere documentación adicional necesaria
   - Advierte sobre plazos legales (si aplica)

VIII. ADVERTENCIAS LEGALES (SI APLICA)
   - Indica claramente cualquier riesgo legal
   - Señala posibles sanciones o responsabilidades
   - Menciona requisitos de cumplimiento obligatorio

ESTILO Y TONO:
- Lenguaje jurídico formal pero comprensible
- Redacción clara, precisa y objetiva
- Evita ambigüedades
- Usa terminología legal correcta
- Estructura párrafos con claridad
- Numera secciones y subsecciones
- Usa negritas para resaltar conceptos clave

CONSIDERACIONES IMPORTANTES:
1. FUNDAMENTACIÓN: Toda conclusión debe estar respaldada por normativa específica
2. CITAS EXACTAS: Cita textualmente los artículos relevantes
3. JERARQUÍA NORMATIVA: Respeta el orden constitucional → leyes → reglamentos
4. ACTUALIDAD: Indica si conoces reformas o derogaciones de normas
5. PRECEDENTES: Menciona criterios jurisprudenciales establecidos
6. CLARIDAD: El dictamen debe ser comprensible para el solicitante
7. COMPLETITUD: Aborda todos los aspectos planteados
8. OBJETIVIDAD: Presenta un análisis imparcial y técnico

FORMATO DE SALIDA:
- Usa formato Markdown para mejor legibilidad
- Usa ## para títulos de secciones principales
- Usa ### para subsecciones
- Usa **negritas** para destacar conceptos clave
- Usa listas numeradas para conclusiones y recomendaciones
- Usa > para citas textuales de artículos legales

ADVERTENCIA FINAL:
Este dictamen tiene carácter orientador y debe ser revisado por el abogado municipal responsable antes de su aplicación definitiva.`;

    const userPrompt = `ELABORAR DICTAMEN JURÍDICO MUNICIPAL

**ASUNTO:**
${requestData.asunto}

**ANTECEDENTES:**
${requestData.antecedentes}

${requestData.solicitante ? `**SOLICITANTE:**\n${requestData.solicitante}` : ''}

${requestData.cargo_solicitante ? `**CARGO DEL SOLICITANTE:**\n${requestData.cargo_solicitante}` : ''}

${requestData.departamento ? `**DEPARTAMENTO/UNIDAD:**\n${requestData.departamento}` : ''}

${requestData.pregunta_juridica ? `**PREGUNTA(S) JURÍDICA(S):**\n${requestData.pregunta_juridica}` : ''}

${requestData.normativa_sugerida ? `**NORMATIVA QUE SE CONSIDERA RELEVANTE:**\n${requestData.normativa_sugerida}` : ''}

${requestData.documentos_adjuntos ? `**DOCUMENTOS DE REFERENCIA:**\n${requestData.documentos_adjuntos}` : ''}

---

Por favor, elabora un dictamen jurídico completo siguiendo la estructura establecida, con fundamentación legal exhaustiva y citas normativas precisas.`;

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
        temperature: 0.4,
        max_tokens: 4500,
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
    const resultado = openaiData.choices[0]?.message?.content || "No se pudo generar el dictamen jurídico";

    return new Response(
      JSON.stringify({
        resultado,
        metadata: {
          asunto: requestData.asunto,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o",
          tipo_documento: "dictamen_juridico"
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
    console.error("Error en elaboración de dictamen:", error);
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
