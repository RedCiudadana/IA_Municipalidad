import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalizarInversionRequest {
  nombre_proyecto: string;
  monto_inversion: string;
  plazo_ejecucion: string;
  fuente_financiamiento: string;
  ubicacion: string;
  tipo_analisis: string;
  beneficiarios?: string;
  justificacion?: string;
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

  try {
    const requestData: AnalizarInversionRequest = await req.json();

    if (!requestData.nombre_proyecto || !requestData.monto_inversion) {
      return new Response(
        JSON.stringify({ error: "Campos requeridos: nombre_proyecto, monto_inversion" }),
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
        referenciaDocumentos = `\n\nDOCUMENTOS DE REFERENCIA:\n${textosArchivos}`;
      }
    }

    const systemPrompt = `Eres un experto analista de proyectos de inversión pública especializado en el ámbito municipal guatemalteco. Tu función es generar análisis técnicos, financieros y legales completos de proyectos de inversión municipal.

ESTRUCTURA DEL ANÁLISIS DE INVERSIÓN (${requestData.tipo_analisis}):

1. RESUMEN EJECUTIVO
   - Nombre del proyecto
   - Monto de inversión
   - Ubicación y alcance
   - Conclusión principal del análisis

2. DESCRIPCIÓN DEL PROYECTO
   - Objetivo general y específicos
   - Justificación técnica y social
   - Población beneficiaria
   - Alcance territorial

3. ANÁLISIS TÉCNICO
   - Viabilidad técnica del proyecto
   - Especificaciones técnicas principales
   - Recursos requeridos (humanos, materiales, tecnológicos)
   - Cronograma de ejecución
   - Riesgos técnicos identificados

4. ANÁLISIS FINANCIERO
   - Desglose detallado del presupuesto
   - Fuentes de financiamiento
   - Flujo de caja proyectado
   - Indicadores financieros:
     * VAN (Valor Actual Neto)
     * TIR (Tasa Interna de Retorno)
     * Relación Beneficio/Costo
   - Análisis de sostenibilidad financiera
   - Punto de equilibrio

5. ANÁLISIS ECONÓMICO-SOCIAL
   - Beneficios económicos esperados
   - Impacto social del proyecto
   - Generación de empleo
   - Contribución al desarrollo local
   - Beneficios intangibles

6. ANÁLISIS DE RIESGOS
   - Identificación de riesgos:
     * Técnicos
     * Financieros
     * Ambientales
     * Sociales
     * Legales
   - Matriz de probabilidad e impacto
   - Estrategias de mitigación

7. MARCO LEGAL Y NORMATIVO
   - Leyes y normativas aplicables:
     * Ley de Contrataciones del Estado
     * Ley Orgánica del Presupuesto
     * Código Municipal
     * Normativa ambiental
     * Otras regulaciones específicas
   - Permisos y autorizaciones requeridas
   - Cumplimiento normativo

8. EVALUACIÓN DE ALTERNATIVAS
   - Alternativas consideradas
   - Análisis comparativo
   - Justificación de la alternativa seleccionada

9. SOSTENIBILIDAD
   - Sostenibilidad ambiental
   - Sostenibilidad social
   - Sostenibilidad institucional
   - Plan de operación y mantenimiento

10. CONCLUSIONES Y RECOMENDACIONES
    - Viabilidad del proyecto (técnica, financiera, legal)
    - Principales hallazgos
    - Recomendaciones específicas
    - Condiciones para la aprobación
    - Próximos pasos

FORMATO:
- Análisis técnico riguroso con datos cuantitativos
- Cálculos financieros fundamentados
- Referencias a normativa legal específica
- Conclusiones objetivas basadas en evidencia
- Tablas y datos estructurados cuando sea necesario

IMPORTANTE:
- Si hay documentos de referencia, analízalos e incorpóralos en el análisis
- Proporciona cálculos financieros realistas
- Identifica riesgos críticos
- Asegura cumplimiento normativo
- Emite recomendaciones claras y accionables`;

    const userPrompt = `Genera un análisis ${requestData.tipo_analisis} completo para el siguiente proyecto de inversión municipal:

DATOS DEL PROYECTO:
- Nombre: ${requestData.nombre_proyecto}
- Monto de inversión: Q. ${requestData.monto_inversion}
- Plazo de ejecución: ${requestData.plazo_ejecucion}
- Fuente de financiamiento: ${requestData.fuente_financiamiento}
- Ubicación: ${requestData.ubicacion}
${requestData.beneficiarios ? `- Beneficiarios: ${requestData.beneficiarios}` : ''}
${requestData.justificacion ? `- Justificación: ${requestData.justificacion}` : ''}
${referenciaDocumentos}

Genera un análisis profesional, completo y detallado que permita tomar decisiones fundamentadas sobre la viabilidad del proyecto. Incluye cálculos financieros, análisis de riesgos y recomendaciones específicas.`;

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
    const analisis = openaiData.choices[0]?.message?.content || "No se pudo generar el análisis";

    const firmaFinal = requestData.usuario_nombre
      ? `\n\n---\nElaborado por: ${requestData.usuario_nombre}\n${requestData.usuario_cargo || 'Departamento Jurídico'}\nMunicipalidad de Guatemala`
      : '';

    return new Response(
      JSON.stringify({
        analisis: analisis + firmaFinal,
        metadata: {
          proyecto: requestData.nombre_proyecto,
          monto: requestData.monto_inversion,
          tipo_analisis: requestData.tipo_analisis,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o",
          tokens: openaiData.usage?.total_tokens || 0
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
    console.error("Error en análisis de inversión:", error);
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
