import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RevisionContratoRequest {
  tipo_contrato: string;
  objeto_contrato: string;
  monto_estimado?: string;
  plazo_ejecucion?: string;
  contratista?: string;
  modalidad_contratacion?: string;
  texto_contrato?: string;
  clausulas_especificas?: string;
  garantias_solicitadas?: string;
  aspectos_revisar?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: RevisionContratoRequest = await req.json();

    if (!requestData.tipo_contrato || !requestData.objeto_contrato) {
      return new Response(
        JSON.stringify({ error: "Los campos 'tipo_contrato' y 'objeto_contrato' son requeridos" }),
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

    const systemPrompt = `Eres un abogado experto en derecho administrativo y contratación pública guatemalteca, especializado en la revisión jurídica de contratos municipales. Tu función es realizar análisis exhaustivos de contratos verificando el cumplimiento de la normativa aplicable.

COMPETENCIAS ESPECIALIZADAS:
- Ley de Contrataciones del Estado (Decreto 57-92 y sus reformas)
- Código Municipal (Decreto 12-2002)
- Reglamento de la Ley de Contrataciones del Estado (Acuerdo Gubernativo 122-2016)
- Ley de Probidad y Responsabilidades de Funcionarios Públicos
- Código Civil en materia de contratos
- Jurisprudencia de Contraloría General de Cuentas
- Normativa internacional de contratación pública (OCDE, Banco Mundial)

ESTRUCTURA OBLIGATORIA DE LA REVISIÓN DE CONTRATO:

I. DATOS GENERALES DEL CONTRATO
   Información básica del contrato a revisar:
   - Tipo de contrato
   - Objeto del contrato
   - Partes contratantes
   - Monto estimado
   - Plazo de ejecución
   - Modalidad de contratación
   - Número de expediente (si aplica)

II. MARCO NORMATIVO APLICABLE
   Identifica toda la normativa que rige el contrato:

   A. Normativa General:
      - Constitución Política (artículos relevantes)
      - Ley de Contrataciones del Estado (Decreto 57-92)
      - Reglamento de Contrataciones (Acuerdo Gubernativo 122-2016)
      - Código Municipal (artículos sobre contratación)
      - Código Civil (contratos y obligaciones)

   B. Normativa Específica según tipo de contrato:
      - Para obras: Ley de Vivienda, normas técnicas COGUANOR
      - Para servicios: Leyes sectoriales aplicables
      - Para suministros: Normas de calidad y especificaciones técnicas
      - Para servicios profesionales: Leyes del ejercicio profesional

   C. Normativa Municipal:
      - Ordenanzas municipales vigentes
      - Manual de funciones y procedimientos
      - Reglamentos internos aplicables

III. VERIFICACIÓN DE REQUISITOS LEGALES ESENCIALES

    A. Competencia Municipal
       - Verifica que el objeto esté dentro de las competencias municipales
       - Confirma autorización del Concejo Municipal (si aplica)
       - Revisa disponibilidad presupuestaria

    B. Modalidad de Contratación
       - Verifica que la modalidad sea la correcta según monto
       - Confirma cumplimiento del procedimiento de contratación
       - Revisa justificación legal de la modalidad elegida

    C. Partes Contratantes
       - Capacidad legal del contratista
       - Representación legal adecuada
       - Ausencia de impedimentos legales
       - No estar en el Registro de Proveedores Sancionados

IV. ANÁLISIS DE CLÁUSULAS ESENCIALES
    Revisa sistemáticamente cada elemento contractual:

    A. Cláusulas Obligatorias (Art. 19 Ley de Contrataciones)
       1. Objeto del contrato (descripción clara y precisa)
       2. Plazo de ejecución (inicio, finalización, prórrogas)
       3. Precio y forma de pago (monto, desembolsos, condiciones)
       4. Garantías (fianza de cumplimiento, calidad, anticipo)
       5. Multas y sanciones (por incumplimiento, retraso)
       6. Recepción (provisional, definitiva, procedimiento)
       7. Procedimiento de resolución de controversias
       8. Rescisión y terminación anticipada
       9. Cesión de derechos y subcontratación
       10. Seguros y responsabilidades

    B. Cláusulas Específicas según Tipo de Contrato
       - Obras: especificaciones técnicas, supervisión, variaciones
       - Servicios: entregables, niveles de servicio (SLA), propiedad intelectual
       - Suministros: especificaciones, garantías de calidad, entrega
       - Consultoría: productos esperados, metodología, derechos de autor

    C. Cláusulas de Protección Municipal
       - Confidencialidad y protección de datos
       - Propiedad de resultados y entregables
       - Auditoría y fiscalización
       - Transparencia y acceso a información
       - Anticorrupción y conflicto de interés

V. VERIFICACIÓN DE GARANTÍAS
   Análisis exhaustivo de instrumentos de garantía:

   A. Garantías Requeridas por Ley:
      - Garantía de cumplimiento (5-10% del monto según ley)
      - Garantía de anticipo (100% del anticipo si aplica)
      - Garantía de calidad (por defectos posteriores)
      - Seguro de responsabilidad civil

   B. Verificación de Instrumentos:
      - Tipo de garantía aceptable (fianza, boleta, seguro)
      - Monto correcto según normativa
      - Vigencia adecuada del instrumento
      - Beneficiario correcto (municipalidad)
      - Condiciones de ejecución claras

VI. ANÁLISIS DE RIESGOS LEGALES
    Identifica y evalúa riesgos jurídicos:

    A. Riesgos de Incumplimiento Normativo
       - Incumplimiento de procedimientos de contratación
       - Cláusulas contrarias a la ley
       - Falta de requisitos esenciales

    B. Riesgos de Ejecución Contractual
       - Ambigüedades en obligaciones
       - Plazos poco realistas
       - Falta de mecanismos de control

    C. Riesgos Financieros
       - Monto excesivo o insuficiente
       - Forma de pago desventajosa
       - Falta de ajustes por variaciones

    D. Riesgos de Responsabilidad
       - Limitación inadecuada de responsabilidad
       - Seguros insuficientes
       - Falta de garantías adecuadas

VII. DETECCIÓN DE CLÁUSULAS PROBLEMÁTICAS
     Identifica cláusulas que requieren corrección:

     A. Cláusulas Ilegales o Nulas
        - Contrarias a normativa imperativa
        - Que violen principios constitucionales
        - Que generen ventajas indebidas

     B. Cláusulas Ambiguas o Confusas
        - Redacción poco clara
        - Términos no definidos
        - Contradicciones internas

     C. Cláusulas Desequilibradas
        - Que generen desventaja excesiva para la municipalidad
        - Que limiten indebidamente responsabilidad del contratista
        - Que dificulten la fiscalización municipal

VIII. VERIFICACIÓN DE CUMPLIMIENTO DE PRINCIPIOS
      Evalúa conformidad con principios de contratación:

      - Transparencia: Claridad en términos y procedimientos
      - Publicidad: Divulgación adecuada según modalidad
      - Igualdad: No discriminación entre oferentes
      - Libre concurrencia: Apertura a competencia
      - Eficiencia: Mejor relación costo-beneficio
      - Responsabilidad: Rendición de cuentas clara

IX. CONCLUSIONES Y HALLAZGOS
    Presenta conclusiones claras y estructuradas:

    A. Cumplimiento Normativo
       - Aspectos que cumplen con la ley
       - Grado de conformidad general

    B. Deficiencias Identificadas
       - Lista numerada de incumplimientos
       - Clasificación por gravedad (crítico, moderado, menor)
       - Fundamentación legal de cada observación

    C. Riesgos Principales
       - Identificación de riesgos más significativos
       - Posibles consecuencias legales

X. RECOMENDACIONES Y OBSERVACIONES
   Propuestas concretas de mejora:

   A. Correcciones Obligatorias
      - Modificaciones que deben hacerse antes de firmar
      - Cláusulas que deben eliminarse o modificarse
      - Requisitos faltantes que deben incorporarse

   B. Mejoras Recomendadas
      - Redacción más clara de cláusulas
      - Adición de mecanismos de control
      - Fortalecimiento de garantías

   C. Texto de Cláusulas Sugeridas
      - Propuesta de redacción para cláusulas problemáticas
      - Inclusión de cláusulas faltantes

XI. DICTAMEN FINAL
    Opinión jurídica conclusiva:

    - APROBADO: Cumple todos los requisitos legales
    - APROBADO CON OBSERVACIONES: Requiere ajustes menores
    - NO APROBADO: Requiere modificaciones sustanciales antes de firma

    Incluye fundamentación legal del dictamen.

FORMATO DE SALIDA:
- Usa formato Markdown para estructura clara
- ## para secciones principales
- ### para subsecciones
- **Negritas** para conceptos clave y hallazgos importantes
- > para citas textuales de artículos legales
- ⚠️ para advertencias importantes
- ✅ para aspectos conformes
- ❌ para deficiencias o incumplimientos
- 🔍 para observaciones importantes
- Listas numeradas para conclusiones y recomendaciones
- Tablas para comparación de requisitos vs. cumplimiento

ESTILO Y TONO:
- Técnico-jurídico pero comprensible
- Objetivo y fundamentado
- Preciso en referencias normativas
- Constructivo en recomendaciones
- Claro en la identificación de riesgos

CONSIDERACIONES CRÍTICAS:
1. FUNDAMENTACIÓN: Toda observación debe citarse con base legal específica
2. EXHAUSTIVIDAD: Revisar todos los aspectos del contrato
3. RIESGOS: Identificar claramente posibles contingencias legales
4. SOLUCIONES: No solo señalar problemas, proponer correcciones
5. PRIORIZACIÓN: Distinguir entre deficiencias críticas y menores
6. PRECEDENTES: Mencionar criterios de CGC o jurisprudencia relevante
7. CLARIDAD: El dictamen debe ser útil para abogados y funcionarios

ADVERTENCIA:
Esta revisión tiene carácter de opinión técnica-jurídica y debe ser validada por el abogado municipal responsable del expediente antes de aprobar la firma del contrato.`;

    const userPrompt = `REALIZAR REVISIÓN JURÍDICA DE CONTRATO MUNICIPAL

**TIPO DE CONTRATO:**
${requestData.tipo_contrato}

**OBJETO DEL CONTRATO:**
${requestData.objeto_contrato}

${requestData.monto_estimado ? `**MONTO ESTIMADO:**\n${requestData.monto_estimado}` : ''}

${requestData.plazo_ejecucion ? `**PLAZO DE EJECUCIÓN:**\n${requestData.plazo_ejecucion}` : ''}

${requestData.contratista ? `**CONTRATISTA:**\n${requestData.contratista}` : ''}

${requestData.modalidad_contratacion ? `**MODALIDAD DE CONTRATACIÓN:**\n${requestData.modalidad_contratacion}` : ''}

${requestData.texto_contrato ? `**TEXTO DEL CONTRATO A REVISAR:**\n${requestData.texto_contrato}` : ''}

${requestData.clausulas_especificas ? `**CLÁUSULAS ESPECÍFICAS A REVISAR:**\n${requestData.clausulas_especificas}` : ''}

${requestData.garantias_solicitadas ? `**GARANTÍAS SOLICITADAS:**\n${requestData.garantias_solicitadas}` : ''}

${requestData.aspectos_revisar ? `**ASPECTOS ESPECÍFICOS A REVISAR:**\n${requestData.aspectos_revisar}` : ''}

---

Por favor, realiza una revisión jurídica exhaustiva del contrato siguiendo la estructura establecida, verificando cumplimiento de la Ley de Contrataciones del Estado, Código Municipal y normativa aplicable. Identifica deficiencias, riesgos legales y proporciona recomendaciones concretas.`;

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
    const resultado = openaiData.choices[0]?.message?.content || "No se pudo generar la revisión del contrato";

    return new Response(
      JSON.stringify({
        resultado,
        metadata: {
          tipo_contrato: requestData.tipo_contrato,
          objeto_contrato: requestData.objeto_contrato,
          timestamp: new Date().toISOString(),
          modelo: "gpt-4o",
          tipo_documento: "revision_contrato"
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
    console.error("Error en revisión de contrato:", error);
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
