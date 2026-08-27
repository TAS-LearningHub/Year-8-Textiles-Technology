(function () {
  "use strict";

  const assessment = Object.freeze({
    version: "1.0.0",
    schemaVersion: 1,
    courseId: "year-8-textiles-technology-2026",
    verifiedAt: "2026-08-27",
    pageStatus: "Learning evidence orientation — this is not a formal task notification",
    formalAuthorityBoundary: {
      status: "Current notification required",
      statement: "Use this page to organise useful learning evidence. Your teacher's current approved task notification controls every formal requirement.",
      doNotDo: "Do not treat this webpage, its saved records or its examples as a due date, weighting, rubric, submission instruction or proof of practical performance."
    },
    orientation: {
      purpose: "Use this page to understand the kinds of evidence the course may develop and to prepare useful project records. It is not a current formal assessment notification.",
      nextAction: "Keep selected, privacy-safe evidence as you work: design decisions, material testing, pattern planning, practical checkpoints and evaluation. Check the teacher-issued notification before treating any item as a formal requirement.",
      supportBoundary: "The practical, folio, safety and knowledge areas below are learning-support categories drawn from the authorised program. Formal task details come from the current teacher-issued notification.",
      practicalBoundary: "Browser records cannot prove safe performance, practical competence, teacher observation or submission."
    },
    confirmationStatus: [
      { domain: "Learning evidence categories", status: "Confirmed", detail: "The project, folio, safety and knowledge categories are grounded in the authorised course program." },
      { domain: "Formal task requirements", status: "Current notification required", detail: "Task name, dates, weighting, outcomes, rubric, compulsory evidence and submission method are not set by this webpage." },
      { domain: "Browser records", status: "Local practice only", detail: "Saved writing and checks stay on this device and do not prove submission, practical competence or teacher observation." }
    ],
    supportAreas: [
      {
        id: "support-practical-projects",
        title: "Practical project evidence",
        status: "Orientation only",
        description: "The authorised program includes a pincushion, a sewing bag and shorts or pants. Keep concise records that show preparation, a relevant quality check, a problem or decision and the result.",
        usefulEvidence: [
          "one privacy-safe image or drawing that proves a distinct checkpoint",
          "a caption explaining the decision, quality check or change shown",
          "a short record of a teacher-confirmed instruction where it affected the next action",
          "a final product judgement against student practice criteria"
        ],
        boundary: "Exact dimensions, techniques, sequence, task allocation, marks and teacher-observed performance are Teacher to confirm.",
        folioStageIds: ["stage-07-progress-evidence", "stage-09-evaluation-reflection"]
      },
      {
        id: "support-design-folio",
        title: "Design and folio evidence",
        status: "Orientation only",
        description: "The authorised folio source supports inspiration, front and back design communication, aesthetic and functional features, care information and evaluation.",
        usefulEvidence: [
          "ethical inspiration and a traceable source record",
          "front and back design views with purposeful annotations",
          "reasoned aesthetic and functional feature choices",
          "material testing and commercial-pattern planning",
          "care-label and swing-tag communication based on verified facts",
          "evaluation and reflection using selected evidence"
        ],
        boundary: "Any checklist requirement hidden in source tables or images, formal criteria and submission method are Teacher to confirm.",
        folioStageIds: ["stage-01-inspiration", "stage-03-front-back-design", "stage-04-aesthetic-functional", "stage-05-material-tests", "stage-06-pattern-plan", "stage-08-label-tag", "stage-09-evaluation-reflection"]
      },
      {
        id: "support-safety-decisions",
        title: "Safety decision evidence",
        status: "Orientation only",
        description: "Explain how you notice a hazard, consider the possible harm and follow the current stop-check-ask routine and teacher direction.",
        usefulEvidence: [
          "a source-grounded hazard, risk and response explanation",
          "a pre-start check recorded without inventing local rules",
          "a note that identifies when the teacher, current machine or current pattern must control the next step"
        ],
        boundary: "This page does not authorise machine use, specify local controls or verify teacher-observed safe performance.",
        moduleSectionIds: ["m01-s02", "m02-s02", "m09-s01", "m09-s02"]
      },
      {
        id: "support-knowledge-application",
        title: "Knowledge and application evidence",
        status: "Orientation only",
        description: "Use the section checks, applied-learning activities and long responses to practise explaining how textiles knowledge supports design and production decisions.",
        usefulEvidence: [
          "feedback-rich formative checks completed for revision",
          "an applied-learning record connected to the relevant theory section",
          "a coherent long response that uses evidence and accurate textiles language",
          "a source-bound explanation that keeps local practical facts as Teacher to confirm"
        ],
        boundary: "Formative site records are not automatically formal assessment evidence, marks, submission proof or teacher observation.",
        moduleSectionIds: ["m06-s03", "m07-s02", "m08-s03", "m10-s01", "m10-s03"]
      }
    ],
    capstone: {
      id: "assessment-support-capstone",
      title: "Project evidence capstone",
      status: "Extended learning response - no marks or weighting assigned",
      prompt: "Evaluate how a completed textile product responds to its intended user and purpose. Use selected evidence from the design brief, material testing, pattern planning, practical checkpoints and final testing to justify your judgement and recommend one realistic improvement.",
      scaffold: [
        "Select three or four strong pieces of evidence from different parts of the project and state what each one proves.",
        "Explain how the evidence connects to the user, purpose and at least two design, material, pattern or production decisions.",
        "Make an overall judgement, acknowledge a limitation or trade-off, and justify one realistic improvement."
      ],
      successCriteria: [
        "Uses relevant evidence from at least three project stages and accurate textiles language to build one coherent judgement.",
        "Explains cause and effect, respects Teacher to confirm boundaries and justifies a realistic improvement linked to the user and purpose."
      ],
      minimumGuidance: "Write one connected response. The scaffold supports planning; it does not create three separate short-answer questions.",
      field: {
        id: "assessmentSupportCapstoneResponse",
        label: "Extended project evidence response",
        placeholder: "Write one connected response using selected project evidence. Do not invent formal task requirements.",
        minWords: 180
      },
      storageKey: "year8textiles:v1:assessment-support:capstone",
      boundary: "This is an unweighted support task unless a current approved notification explicitly includes it."
    },
    acknowledgement: {
      id: "assessment-orientation-v1",
      version: "assessment-orientation-2026.08.27-v1",
      storageKey: "year8textiles:v1:assessment-read:assessment-orientation-2026.08.27-v1",
      label: "I have opened and read this assessment orientation version.",
      boundary: "This saves a browser-local version and timestamp only. It is not the school notification register, proof of submission, proof of understanding or a replacement for any official process. Clearing browser data or changing devices removes it."
    },
    policy: {
      sourceTitle: "WWHS Assessment Handbooks",
      sourceUrl: "https://sites.google.com/education.nsw.gov.au/wwhsstudentparentinformation/curriculum-information/assessment-handbooks",
      statement: "Use the current official handbook and teacher-issued notification for policies and formal requirements. This dataset does not paraphrase high-consequence absence, late work, malpractice, appeal or adjustment rules."
    },
    teacherNotice: "Before treating any work as formal assessment, use the current teacher-issued notification for the task name, dates, weighting, outcomes, rubric, compulsory evidence and submission method.",
    excluded: [
      "historical criteria presented as current",
      "invented dates, weighting, outcomes, rubric or submission instructions",
      "student names, work samples, photographs, marks or identifying records",
      "Google Classroom links or claims of submission",
      "answers, assessor-only material, passwords and controlled teacher resources"
    ]
  });

  window.YEAR8_TEXTILES_ASSESSMENT_DATA = assessment;
  window.YEAR8_TEXTILES_DATA = window.YEAR8_TEXTILES_DATA || {};
  window.YEAR8_TEXTILES_DATA.assessment = assessment;
})();
