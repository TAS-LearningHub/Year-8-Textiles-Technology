(function () {
  "use strict";

  const folio = Object.freeze({
    version: "1.0.0",
    courseId: "year-8-textiles-technology-2026",
    projectId: "apparel-bottoms",
    schemaVersion: 2,
    textStorageKey: "year8textiles:v1:folio:apparel:text:v2",
    imageStorageKey: "year8textiles:v1:folio:apparel:images:v2",
    legacyKeys: [],
    maxImageBytes: 665600,
    acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    sourceVersion: {
      sourceMap: "source-map-v1.0",
      localProgramDigest: "494e64592ca8e7ad911819f7978ce505f3a043f5475b1e471d9f302362e589c9",
      folioChecklistDigest: "23ff6667ec3b7a402afc03deef3514acd8c2102227380671c2b45b7c124871e2",
      patternWorksheetDigest: "97331cb3fc5ee30d1a20fe0dc7bb06ecc4c51001bb2ca557aa2015376ed0a3f6",
      moodboardDigest: "1b9bc463cf6c89da349f56cd0a58e42d963d40ae26ce1cfc41549313fd00d476"
    },
    orientation: {
      purpose: "This folio keeps selected evidence of your apparel design decisions, material and pattern planning, production checkpoints, testing and reflection. It is a concise project record, not a copy of every lesson response or quiz.",
      firstAction: "Start with Stage 1 by recording the direction of your inspiration and the sources you are authorised to use. The folio can then show your next incomplete stage when it is integrated.",
      saving: "Writing and imported images save only in this browser on this device until you download an editable backup or self-contained export.",
      assessmentBoundary: "This is a source-grounded working folio. It is not proof of submission, a formal mark, or proof of teacher-observed practical performance. Current assessment requirements and submission arrangements are Teacher to confirm.",
      imagePrivacy: "Import only teacher-authorised images of your own drawings, tests or textile work. Avoid faces, names, timetables, screens and identifying background details. Accepted images remain browser-local and are included in editable backup and self-contained export files.",
      practicalBoundary: "Record the decisions and evidence you can observe. Exact machine setup, pattern alterations, construction sequence and local safety controls must follow the current pattern, machine, teacher demonstration and classroom risk controls."
    },
    projectContext: {
      courseProjects: ["Pincushion", "Sewing bag", "Shorts or pants"],
      folioFocus: "The nine evidence stages below organise the major apparel project. Short practical records from the pincushion and sewing bag may be selected as supporting evidence only when the teacher confirms they belong in the current folio.",
      sourceIntent: "The authorised program describes small textile projects, one major apparel item and design documentation. The current folio checklist explicitly supports inspiration, front and back design communication, aesthetic and functional features, care information and product communication.",
      unresolved: "Teacher to confirm whether any checklist content hidden in source tables or images remains required."
    },
    stages: [
      {
        id: "stage-01-inspiration",
        number: 1,
        title: "Build purposeful inspiration",
        action: "Curate a mood board that gives your apparel design a clear direction.",
        why: "A purposeful mood board helps you make connected decisions about colour, texture, pattern, mood and user rather than collecting attractive images at random.",
        evidence: "An original or teacher-authorised mood board, a short design direction and a traceable source record.",
        prompt: "What direction does your inspiration suggest, and which details are genuinely useful for your intended user and product?",
        support: ["My design direction is…", "The most useful colour, texture or shape is… because…", "This source is appropriate to use because…"],
        source: "Authorised CANVA mood-board instructions: 6–10 images, 4–6 colours, 3 textile samples and 4–6 keywords. Ethical source use follows Module 5; Classroom submission is not claimed.",
        activityIds: ["act-14-m05-s02", "act-15-m05-s03"],
        theorySectionIds: ["m05-s02", "m05-s03"],
        image: true,
        imageLabel: "Mood board or inspiration evidence",
        fields: [
          { id: "direction", label: "Design direction", placeholder: "Explain the mood, user and product direction in 2–4 clear sentences.", minWords: 25 },
          { id: "usefulDetails", label: "Useful visual and textile details", placeholder: "Identify the colours, textures, patterns, shapes or textile samples that will influence decisions, and explain why.", minWords: 30 },
          { id: "sourceRecord", label: "Source and permission record", placeholder: "For each external source, record creator or organisation, title, link or publication details, and why you are authorised to use or reference it.", minWords: 20 },
          { id: "caption", label: "Mood-board caption", placeholder: "What design direction does this evidence prove?", minWords: 12 }
        ]
      },
      {
        id: "stage-02-brief-user",
        number: 2,
        title: "Define the brief and user",
        action: "Restate the teacher-issued apparel brief and define the intended user or target market.",
        why: "A clear brief keeps design choices tied to the real purpose, user and confirmed constraints.",
        evidence: "A brief statement, user profile, confirmed constraints and a small set of observable practice criteria.",
        prompt: "What must the apparel product do for its intended user, and what evidence would show that it succeeds?",
        support: ["The product needs to…", "The intended user values…", "A confirmed constraint is…", "Success could be checked by…"],
        source: "2024 local program, Module 5 design brief and Module 8 target-market theory. Exact dimensions, pattern, materials, budget and formal criteria are Teacher to confirm.",
        activityIds: ["act-13-m05-s01", "act-22-m08-s01"],
        theorySectionIds: ["m05-s01", "m08-s01"],
        image: false,
        fields: [
          { id: "brief", label: "Brief in your own words", placeholder: "State what will be designed and made, its purpose and only the requirements that have been confirmed.", minWords: 30 },
          { id: "user", label: "Intended user or target market", placeholder: "Describe relevant needs, preferences, context and inclusive considerations without adding private personal information.", minWords: 30 },
          { id: "constraints", label: "Confirmed constraints", placeholder: "List only confirmed limits. Write Teacher to confirm beside anything unresolved.", minWords: 15 },
          { id: "practiceCriteria", label: "Observable practice criteria", placeholder: "Draft 3–5 criteria and name the evidence that could test each one. These are not formal marking criteria.", minWords: 35 }
        ]
      },
      {
        id: "stage-03-front-back-design",
        number: 3,
        title: "Communicate the front and back design",
        action: "Create and annotate clear front and back views of your proposed shorts or pants.",
        why: "Two views reveal decisions that one drawing can hide and help another person understand the planned product.",
        evidence: "A student-created front-and-back design with concise annotations and a design rationale.",
        prompt: "How do the front and back views communicate the product’s form, intended features and relationship to the brief?",
        support: ["The front view communicates…", "The back view adds…", "This feature responds to the user by…", "A detail still to confirm is…"],
        source: "Authorised Year 8 folio checklist and Module 8 final-design communication. The drawing is a design record, not a substitute for the current commercial pattern.",
        activityIds: ["act-24-m08-s03"],
        theorySectionIds: ["m08-s03"],
        image: true,
        imageLabel: "Front and back apparel design",
        fields: [
          { id: "frontNotes", label: "Front-view annotations", placeholder: "Label the features that matter to purpose, user, appearance or construction planning.", minWords: 25 },
          { id: "backNotes", label: "Back-view annotations", placeholder: "Label the details that are different or clearer from the back.", minWords: 20 },
          { id: "rationale", label: "Design rationale", placeholder: "Explain how the complete design responds to the brief, user and inspiration evidence.", minWords: 45 },
          { id: "caption", label: "Design-evidence caption", placeholder: "What decisions does this front-and-back design prove?", minWords: 12 }
        ]
      },
      {
        id: "stage-04-aesthetic-functional",
        number: 4,
        title: "Justify aesthetic and functional features",
        action: "Separate the product’s aesthetic features from its functional features, then explain how they work together.",
        why: "A strong design can communicate a clear visual identity while still meeting user, comfort, movement and practical needs.",
        evidence: "Annotated feature evidence, a reasoned justification and one identified trade-off or uncertainty.",
        prompt: "Which features mainly shape appearance, which support use, and where does one decision affect both?",
        support: ["An aesthetic feature is… and it contributes…", "A functional feature is… because…", "This feature affects both by…", "The trade-off is…"],
        source: "Authorised Year 8 folio checklist, Module 8 aesthetic/functional theory and NESA textile design and product development content.",
        activityIds: ["act-23-m08-s02"],
        theorySectionIds: ["m08-s02"],
        image: true,
        imageLabel: "Annotated aesthetic and functional feature detail",
        fields: [
          { id: "aesthetic", label: "Aesthetic features", placeholder: "Identify the relevant colour, line, shape, texture, pattern or decorative decisions and explain their effect.", minWords: 30 },
          { id: "functional", label: "Functional features", placeholder: "Identify features connected to purpose, fit, movement, durability, care or ease of use and explain their role.", minWords: 35 },
          { id: "tradeoff", label: "Connection or trade-off", placeholder: "Explain one decision that affects both appearance and function, including any uncertainty to check.", minWords: 30 },
          { id: "caption", label: "Feature-evidence caption", placeholder: "What design relationship does this annotation prove?", minWords: 12 }
        ]
      },
      {
        id: "stage-05-material-tests",
        number: 5,
        title: "Test and select materials",
        action: "Record a fair material test and use the result to justify an end-use decision.",
        why: "A material choice is stronger when evidence connects a relevant property with the user, product and construction needs.",
        evidence: "A test question, fair method, observable result, labelled test evidence and a justified material decision.",
        prompt: "What property matters for this apparel product, how was it tested fairly, and what does the evidence support?",
        support: ["The relevant property is… because…", "To keep the comparison fair, I…", "The evidence showed…", "Therefore this material is / is not suitable because…"],
        source: "2024 local program Week 8, introductory textile source and Module 6 properties/testing theory. Supplied materials and fibre content are Teacher to confirm.",
        activityIds: ["act-18-m06-s03"],
        theorySectionIds: ["m06-s03"],
        image: true,
        imageLabel: "Material-test evidence",
        fields: [
          { id: "testQuestion", label: "Property and test question", placeholder: "Name the property and explain why it matters for the intended end use.", minWords: 25 },
          { id: "method", label: "Fair method", placeholder: "Record what was compared, what stayed the same and what was observed or measured. Use only teacher-approved procedures.", minWords: 35 },
          { id: "result", label: "Result and limitation", placeholder: "Record the observable result and one factor that limits the strength of the conclusion.", minWords: 30 },
          { id: "decision", label: "Material decision", placeholder: "Use the evidence to justify suitability for this user and product.", minWords: 35 },
          { id: "caption", label: "Test-evidence caption", placeholder: "What property comparison does this image prove?", minWords: 12 }
        ]
      },
      {
        id: "stage-06-pattern-plan",
        number: 6,
        title: "Plan with the current commercial pattern",
        action: "Show how the current pattern, size decision, markings and layout inform a responsible cutting plan.",
        why: "Pattern literacy helps translate a two-dimensional source into accurate pieces while reducing avoidable cutting errors and waste.",
        evidence: "A privacy-safe size-choice explanation, pattern-source check, markings record, approved layout plan and any teacher-approved alteration.",
        prompt: "Which pattern information must be confirmed before cutting, and how does your plan protect accuracy, grain direction and efficient material use?",
        support: ["The current pattern source shows…", "The size decision was confirmed by…", "The marking matters because…", "Before cutting, I need to confirm…"],
        source: "2026 commercial-pattern worksheet, Sewing Patterns Made Simple as general literacy support and Module 7. The current pattern, size range, pieces, allowances, layout and alterations are Teacher to confirm.",
        activityIds: ["act-19-m07-s01", "act-20-m07-s02", "act-21-m07-s03"],
        theorySectionIds: ["m07-s01", "m07-s02", "m07-s03"],
        image: true,
        imageLabel: "Annotated pattern or layout planning evidence",
        fields: [
          { id: "sizeChoice", label: "Privacy-safe size-choice evidence", placeholder: "Explain how the current measurement and pattern information supported a size decision. Do not record personal measurement values unless the teacher directs an approved private method.", minWords: 25 },
          { id: "patternSource", label: "Current pattern-source check", placeholder: "Record the approved pattern identity or write Teacher to confirm, then note which information must be read before use.", minWords: 20 },
          { id: "markings", label: "Pieces, markings and grainline", placeholder: "Explain the purpose of the relevant markings without inventing pattern-specific details.", minWords: 35 },
          { id: "layout", label: "Layout and resource plan", placeholder: "Explain how the approved layout supports orientation, required pieces, usable fabric and reduced waste.", minWords: 35 },
          { id: "alteration", label: "Approved alteration record", placeholder: "Record only a teacher-approved alteration and its reason, or write No alteration confirmed.", minWords: 12 },
          { id: "caption", label: "Pattern-planning caption", placeholder: "What pre-cut decision does this evidence prove?", minWords: 12 }
        ]
      },
      {
        id: "stage-07-progress-evidence",
        number: 7,
        title: "Select meaningful progress evidence",
        action: "Record a small number of checkpoints that show decisions, quality checks, problems and teacher-approved changes.",
        why: "Purposeful checkpoints show how the product developed without turning the folio into a minute-by-minute diary.",
        evidence: "Two or three dated checkpoint records, one teacher-authorised process image with a meaningful caption and one problem/change explanation where relevant.",
        prompt: "Which checkpoints best prove how the plan became a product, and how did evidence influence the next action?",
        support: ["At this checkpoint…", "The quality evidence showed…", "I stopped and confirmed…", "The teacher-approved change was… and the result was…"],
        source: "2024 local program Weeks 11–20, Modules 9.1–9.3 and NESA textile project work. Exact construction sequence and practical permissions remain teacher-controlled.",
        activityIds: ["act-25-m09-s01", "act-26-m09-s02", "act-27-m09-s03"],
        theorySectionIds: ["m09-s01", "m09-s02", "m09-s03"],
        image: true,
        imageLabel: "Teacher-authorised progress checkpoint",
        fields: [
          { id: "checkpointOne", label: "Checkpoint 1", placeholder: "Add date or lesson, stage, evidence checked, decision and next action.", minWords: 30 },
          { id: "checkpointTwo", label: "Checkpoint 2", placeholder: "Choose a later checkpoint that proves a different decision, quality check or change.", minWords: 30 },
          { id: "problemChange", label: "Problem or approved change", placeholder: "Explain cause or evidence, the stop-check-ask response, teacher-approved action and result. If none occurred, explain a preventive quality check instead.", minWords: 40 },
          { id: "caption", label: "Progress-image caption", placeholder: "What distinct decision, quality check or change does this image prove?", minWords: 15 }
        ]
      },
      {
        id: "stage-08-label-tag",
        number: 8,
        title: "Create the care label and swing tag",
        action: "Use verified material information to draft care communication and a concise swing tag for the intended audience.",
        why: "Product communication should be useful, supportable and suited to its audience rather than based on guessed fabric or care claims.",
        evidence: "Verified material facts, draft care information, a swing-tag message and a source check.",
        prompt: "Which facts can you support, how should they be communicated, and what must remain unresolved until verified?",
        support: ["The verified material information is…", "The care information is based on…", "The swing tag tells the user…", "I cannot yet claim… because…"],
        source: "Authorised Year 8 folio checklist and Module 10 care-label/swing-tag theory. Fibre content, care symbols, compliance details and required wording are Teacher to confirm unless supported by the supplied material source.",
        activityIds: ["act-29-m10-s02"],
        theorySectionIds: ["m10-s02"],
        image: true,
        imageLabel: "Care-label and swing-tag draft",
        fields: [
          { id: "verifiedFacts", label: "Verified material facts", placeholder: "Record only facts supported by the supplied material information or another authorised source.", minWords: 20 },
          { id: "careInformation", label: "Draft care information", placeholder: "Draft useful care communication and note the source. Mark any unresolved detail Teacher to confirm.", minWords: 30 },
          { id: "swingTag", label: "Swing-tag message", placeholder: "Write a concise product identity, purpose or feature message for the intended audience. Avoid unsupported claims.", minWords: 25 },
          { id: "sourceCheck", label: "Claim and source check", placeholder: "List each important claim and the source that supports it, or identify it as unresolved.", minWords: 25 },
          { id: "caption", label: "Label/tag caption", placeholder: "What audience and verified information does this draft communicate?", minWords: 12 }
        ]
      },
      {
        id: "stage-09-evaluation-reflection",
        number: 9,
        title: "Evaluate, reflect and communicate",
        action: "Test the final product against the practice criteria, make an evidence-based judgement and identify one realistic improvement.",
        why: "Evaluation closes the design cycle by connecting the finished result with the original brief, user and decisions.",
        evidence: "Criterion-by-criterion testing, final product evidence, an overall judgement, a realistic improvement and a privacy-safe reflection or showcase contribution.",
        prompt: "How well does the product meet the brief and intended user’s needs, what evidence supports that judgement, and what should change next time?",
        support: ["Criterion… was met / partly met / not yet met because…", "The strongest evidence is…", "A realistic improvement is… because…", "My contribution to a privacy-safe showcase could be…"],
        source: "2024 local program evaluation intent, authorised folio checklist and Modules 10.1 and 10.3. Formal marking criteria and submission remain Teacher to confirm.",
        activityIds: ["act-28-m10-s01", "act-30-m10-s03"],
        theorySectionIds: ["m10-s01", "m10-s03"],
        image: true,
        imageLabel: "Final product or criterion-test evidence",
        fields: [
          { id: "criteriaTest", label: "Criteria test record", placeholder: "For each practice criterion, state met / partly met / not yet met and cite matched evidence.", minWords: 55 },
          { id: "overallJudgement", label: "Overall judgement", placeholder: "Judge how well the product responds to the brief and user, using the strongest evidence.", minWords: 50 },
          { id: "improvement", label: "One realistic improvement", placeholder: "State the change, why it matters and how you would test it next time.", minWords: 35 },
          { id: "reflection", label: "Learning reflection", placeholder: "Explain one important decision, one challenge and what you now understand about textile design or production.", minWords: 45 },
          { id: "showcase", label: "Privacy-safe showcase contribution", placeholder: "Record an agreed role or contribution that shares learning without names, faces or private records, or write Teacher to confirm.", minWords: 20 },
          { id: "caption", label: "Final-evidence caption", placeholder: "Which criterion or judgement does this image support?", minWords: 12 }
        ]
      }
    ],
    capstone: {
      id: "folio-capstone-apparel-judgement",
      title: "Apparel design evidence capstone",
      label: "Extended folio response",
      prompt: "Using selected evidence from your inspiration, brief, design views, material test, pattern plan, progress checkpoints and final testing, evaluate how successfully the apparel product responds to its intended user and purpose. Justify one important decision and recommend one realistic improvement.",
      scaffold: [
        "Select: identify the brief, intended user and the three or four strongest pieces of evidence from different folio stages.",
        "Explain: connect each piece of evidence to a design, material, pattern or production decision using because and therefore reasoning.",
        "Evaluate and improve: judge the overall result against the practice criteria, acknowledge a limitation or trade-off, and justify one realistic improvement."
      ],
      successCriteria: [
        "Builds one coherent judgement using relevant evidence from at least three different folio stages and accurate textiles language.",
        "Explains cause-and-effect reasoning, respects Teacher to confirm boundaries and justifies a realistic improvement linked to the user, purpose and evidence."
      ],
      field: { id: "capstoneResponse", label: "Extended response", placeholder: "Write one connected response. Use the scaffold as planning support rather than answering it as three unrelated questions.", minWords: 180 },
      source: "Synthesises the authorised folio checklist, local project sequence and NESA textile project work. It is not a formal marking criterion or additional task requirement."
    },
    persistenceAndExport: {
      autosave: "Integration runtime should debounce text autosave and save validated image state immediately, with visible saved feedback.",
      migration: "No known compatible Year 8 Textiles folio schema has been supplied. Reject unrelated course/project data; preserve future compatible records by stable stage and field IDs.",
      guardedResetPhrase: "RESET TEXTILES FOLIO",
      editableBackup: "JSON must include course, project and schema identity, writing, timestamps and validated browser-local images.",
      restore: "Reject the wrong course or project and any newer unsupported schema. Validate every restored image type and size.",
      submissionExport: "Self-contained HTML must include stage context, prompts, writing, captions and accepted images. It is an export for teacher-directed use, not proof of submission.",
      print: "Provide a separate A4-friendly print/PDF view with complete stage and capstone context.",
      imageBoundary: "Images remain browser-local unless included in a downloaded backup or self-contained export."
    },
    teacherToConfirm: [
      "whether every folio checklist item hidden in source tables or images remains required",
      "the current pattern, pieces, size range, seam allowances, layout and permitted alterations",
      "supplied materials, fibre content, quantities, notions and decoration options",
      "exact practical evidence required from the pincushion, sewing bag and apparel projects",
      "formal assessment criteria, issue date, due date, weighting, outcome allocation and submission method",
      "whether and where any export is submitted; no Google Classroom submission is claimed"
    ]
  });

  window.YEAR8_TEXTILES_FOLIO_DATA = folio;
  window.YEAR8_TEXTILES_DATA = window.YEAR8_TEXTILES_DATA || {};
  window.YEAR8_TEXTILES_DATA.folio = folio;
})();
