// YESPYQ — UPSC CSE Previous Year Questions (sample bank)
// Representative Prelims-style MCQs grouped by subject & year.
// Replace/extend this array to grow the bank.

const SUBJECTS = [
  { id: "polity",     name: "Polity & Governance", icon: "⚖️" },
  { id: "history",    name: "History & Culture",   icon: "🏛️" },
  { id: "geography",  name: "Geography",           icon: "🌍" },
  { id: "economy",    name: "Economy",             icon: "📈" },
  { id: "environment",name: "Environment & Ecology",icon: "🌱" },
  { id: "science",    name: "Science & Tech",      icon: "🔬" },
  { id: "currentaff", name: "Current Affairs",     icon: "🗞️" },
];

const QUESTIONS = [
  {
    id: "Q2023-POL-01", subject: "polity", year: 2023, paper: "Prelims GS-I",
    q: "With reference to the Indian Constitution, consider the following:\n1. The Preamble can be amended under Article 368.\n2. The Preamble is a part of the Constitution.\nWhich of the statements given above is/are correct?",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 2,
    explanation: "In the Kesavananda Bharati case (1973) the Supreme Court held the Preamble is a part of the Constitution and can be amended under Article 368, provided the basic structure is not destroyed. The Preamble was in fact amended once by the 42nd Amendment (1976)."
  },
  {
    id: "Q2022-POL-02", subject: "polity", year: 2022, paper: "Prelims GS-I",
    q: "Which one of the following best describes the term 'Writ of Mandamus'?",
    options: [
      "An order to produce a detained person before the court",
      "A command to a public authority to perform a duty it has failed to do",
      "An order to a lower court to send the record of a case for review",
      "An order restraining a person from holding an office they are not entitled to"
    ],
    answer: 1,
    explanation: "Mandamus ('we command') is issued by a court to a public official, body, or lower court directing performance of a public or statutory duty that has been wrongly refused. The other options describe Habeas Corpus, Certiorari, and Quo Warranto respectively."
  },
  {
    id: "Q2021-POL-03", subject: "polity", year: 2021, paper: "Prelims GS-I",
    q: "Consider the following statements about the Finance Commission:\n1. It is a constitutional body.\n2. Its recommendations are binding on the government.\nWhich of the statements given above is/are correct?",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 0,
    explanation: "The Finance Commission is constituted under Article 280 and is a constitutional body. However, its recommendations are advisory in nature and not binding on the government."
  },
  {
    id: "Q2023-HIS-01", subject: "history", year: 2023, paper: "Prelims GS-I",
    q: "The 'Doctrine of Lapse' is associated with which of the following Governors-General?",
    options: ["Lord William Bentinck", "Lord Dalhousie", "Lord Curzon", "Lord Ripon"],
    answer: 1,
    explanation: "The Doctrine of Lapse was an annexation policy applied by Lord Dalhousie (1848–1856). States annexed under it included Satara, Jhansi, and Nagpur."
  },
  {
    id: "Q2022-HIS-02", subject: "history", year: 2022, paper: "Prelims GS-I",
    q: "The rock-cut Kailasa temple at Ellora was built under the patronage of which dynasty?",
    options: ["Chalukyas", "Pallavas", "Rashtrakutas", "Cholas"],
    answer: 2,
    explanation: "The monolithic Kailasa (Kailasanatha) temple at Ellora was commissioned by the Rashtrakuta king Krishna I in the 8th century CE."
  },
  {
    id: "Q2021-GEO-01", subject: "geography", year: 2021, paper: "Prelims GS-I",
    q: "Consider the following rivers:\n1. Godavari\n2. Krishna\n3. Cauvery\nWhich of the above flow(s) into the Bay of Bengal?",
    options: ["1 only", "1 and 2 only", "1, 2 and 3", "2 and 3 only"],
    answer: 2,
    explanation: "The Godavari, Krishna, and Cauvery are all east-flowing peninsular rivers that drain into the Bay of Bengal."
  },
  {
    id: "Q2023-GEO-02", subject: "geography", year: 2023, paper: "Prelims GS-I",
    q: "The phenomenon of 'El Niño' is primarily associated with abnormal warming of waters in which ocean?",
    options: ["North Atlantic Ocean", "Equatorial Pacific Ocean", "Indian Ocean", "Southern Ocean"],
    answer: 1,
    explanation: "El Niño refers to the periodic warming of sea-surface temperatures in the central and eastern equatorial Pacific Ocean, which affects global weather including the Indian monsoon."
  },
  {
    id: "Q2022-ECO-01", subject: "economy", year: 2022, paper: "Prelims GS-I",
    q: "In the context of the Indian economy, 'Open Market Operations' refers to:",
    options: [
      "Buying and selling of government securities by the RBI",
      "Lending by commercial banks to priority sectors",
      "Trading of shares on recognised stock exchanges",
      "Auction of foreign exchange by the government"
    ],
    answer: 0,
    explanation: "Open Market Operations (OMO) are the buying and selling of government securities by the Reserve Bank of India to regulate liquidity and money supply in the economy."
  },
  {
    id: "Q2021-ECO-02", subject: "economy", year: 2021, paper: "Prelims GS-I",
    q: "Which of the following is/are included in the foreign exchange reserves of India?\n1. Foreign currency assets\n2. Gold\n3. Special Drawing Rights (SDRs)\nSelect the correct answer:",
    options: ["1 only", "1 and 2 only", "1, 2 and 3", "2 and 3 only"],
    answer: 2,
    explanation: "India's forex reserves comprise Foreign Currency Assets, Gold, SDRs, and the Reserve Tranche Position with the IMF."
  },
  {
    id: "Q2023-ENV-01", subject: "environment", year: 2023, paper: "Prelims GS-I",
    q: "The 'Ramsar Convention' is concerned with the conservation of:",
    options: ["Tropical rainforests", "Wetlands", "Coral reefs", "Migratory birds only"],
    answer: 1,
    explanation: "The Ramsar Convention (1971) is an intergovernmental treaty for the conservation and wise use of wetlands of international importance."
  },
  {
    id: "Q2022-ENV-02", subject: "environment", year: 2022, paper: "Prelims GS-I",
    q: "Which one of the following gases has the highest Global Warming Potential (GWP) over a 100-year horizon?",
    options: ["Carbon dioxide", "Methane", "Nitrous oxide", "Sulphur hexafluoride"],
    answer: 3,
    explanation: "Sulphur hexafluoride (SF6) has an extremely high GWP — tens of thousands of times that of CO2 over 100 years — making it the most potent of the listed greenhouse gases."
  },
  {
    id: "Q2021-SCI-01", subject: "science", year: 2021, paper: "Prelims GS-I",
    q: "Which of the following is the principal reason a CRISPR-Cas9 system is significant in biology?",
    options: [
      "It enables rapid sequencing of whole genomes",
      "It allows precise editing of specific DNA sequences",
      "It synthesises proteins outside living cells",
      "It produces antibiotics from bacteria"
    ],
    answer: 1,
    explanation: "CRISPR-Cas9 is a gene-editing tool that allows precise, targeted modification of DNA sequences, with wide applications in medicine and agriculture."
  },
  {
    id: "Q2023-SCI-02", subject: "science", year: 2023, paper: "Prelims GS-I",
    q: "The ISRO mission 'Chandrayaan-3' primarily aimed to demonstrate which capability?",
    options: [
      "Sample return from the Moon",
      "Soft landing and roving near the lunar south pole",
      "Crewed orbit of the Moon",
      "Establishing a permanent lunar base"
    ],
    answer: 1,
    explanation: "Chandrayaan-3 aimed to demonstrate a safe and soft landing and rover mobility near the lunar south pole — a capability India achieved in August 2023."
  },
  {
    id: "Q2022-CUR-01", subject: "currentaff", year: 2022, paper: "Prelims GS-I",
    q: "The 'PM Gati Shakti' initiative is best described as:",
    options: [
      "A direct cash-transfer scheme for farmers",
      "A national master plan for multimodal infrastructure connectivity",
      "A skill-development programme for youth",
      "A health-insurance scheme for the urban poor"
    ],
    answer: 1,
    explanation: "PM Gati Shakti is a national master plan for multimodal connectivity that integrates the infrastructure projects of various ministries and departments onto a single digital platform."
  },

  /* ---- 2024 ---- */
  {
    id: "Q2024-POL-01", subject: "polity", year: 2024, paper: "Prelims GS-I",
    q: "Consider the following statements regarding the Anti-Defection Law (Tenth Schedule):\n1. The decision on disqualification is taken by the President/Governor.\n2. It applies to both members of Parliament and members of State Legislatures.\nWhich of the statements given above is/are correct?",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 1,
    explanation: "Under the Tenth Schedule, the question of disqualification on the ground of defection is decided by the Presiding Officer (Speaker/Chairman), not the President/Governor. The law applies to members of both Parliament and State Legislatures, so statement 2 is correct."
  },
  {
    id: "Q2024-ECO-01", subject: "economy", year: 2024, paper: "Prelims GS-I",
    q: "In the context of monetary policy, an increase in the 'Cash Reserve Ratio' (CRR) by the RBI generally results in:",
    options: [
      "An increase in the lendable resources of banks",
      "A decrease in the lendable resources of banks",
      "No effect on liquidity in the banking system",
      "An automatic increase in the repo rate"
    ],
    answer: 1,
    explanation: "CRR is the share of deposits banks must keep with the RBI. Raising CRR reduces the funds available with banks to lend, thereby contracting liquidity and money supply."
  },
  {
    id: "Q2024-ENV-01", subject: "environment", year: 2024, paper: "Prelims GS-I",
    q: "Which of the following statements about 'carbon markets' is/are correct?\n1. They allow trading of carbon credits between entities.\n2. They are recognised under Article 6 of the Paris Agreement.\nSelect the correct answer:",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 2,
    explanation: "Carbon markets allow the buying and selling of carbon credits so that emitters can offset emissions. Article 6 of the Paris Agreement provides the framework for cooperative approaches and a centralised carbon market mechanism."
  },
  {
    id: "Q2024-GEO-01", subject: "geography", year: 2024, paper: "Prelims GS-I",
    q: "The 'Lithium Triangle', noted for the world's largest lithium reserves, lies primarily in which region?",
    options: ["Central Africa", "South America", "Central Asia", "South-East Asia"],
    answer: 1,
    explanation: "The Lithium Triangle spans parts of Argentina, Bolivia, and Chile in South America, holding a major share of the world's identified lithium resources in its salt flats (salars)."
  },
  {
    id: "Q2024-HIS-01", subject: "history", year: 2024, paper: "Prelims GS-I",
    q: "The 'Poona Pact' of 1932 was signed between:",
    options: [
      "Mahatma Gandhi and Lord Irwin",
      "B. R. Ambedkar and Mahatma Gandhi",
      "Jawaharlal Nehru and M. A. Jinnah",
      "B. R. Ambedkar and Lord Wavell"
    ],
    answer: 1,
    explanation: "The Poona Pact (1932) was an agreement between B. R. Ambedkar and Mahatma Gandhi that replaced separate electorates for the Depressed Classes with reserved seats within the general electorate."
  },
  {
    id: "Q2024-SCI-01", subject: "science", year: 2024, paper: "Prelims GS-I",
    q: "With reference to 'Quantum Computing', the term 'qubit' refers to:",
    options: [
      "A unit of classical binary information",
      "The basic unit of quantum information that can exist in superposition",
      "A measure of a processor's clock speed",
      "A type of error-correcting code"
    ],
    answer: 1,
    explanation: "A qubit is the fundamental unit of quantum information. Unlike a classical bit (0 or 1), a qubit can exist in a superposition of both states simultaneously, enabling quantum parallelism."
  },
  {
    id: "Q2024-CUR-01", subject: "currentaff", year: 2024, paper: "Prelims GS-I",
    q: "The 'Global Biofuels Alliance', launched on India's initiative, primarily aims to:",
    options: [
      "Regulate global crude oil prices",
      "Accelerate the adoption of sustainable biofuels worldwide",
      "Build a strategic petroleum reserve for member nations",
      "Standardise electric vehicle charging infrastructure"
    ],
    answer: 1,
    explanation: "The Global Biofuels Alliance, launched during India's G20 Presidency in 2023, is an India-led initiative to facilitate cooperation and accelerate the global uptake of sustainable biofuels."
  },

  /* ---- 2025 ---- */
  {
    id: "Q2025-POL-01", subject: "polity", year: 2025, paper: "Prelims GS-I",
    q: "Consider the following with reference to Money Bills under Article 110:\n1. A Money Bill can be introduced only in the Lok Sabha.\n2. The Rajya Sabha can amend or reject a Money Bill.\nWhich of the statements given above is/are correct?",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    answer: 0,
    explanation: "A Money Bill can be introduced only in the Lok Sabha (on the President's recommendation). The Rajya Sabha can only make recommendations within 14 days, which the Lok Sabha may accept or reject — it cannot amend or reject the Bill itself."
  },
  {
    id: "Q2025-ECO-01", subject: "economy", year: 2025, paper: "Prelims GS-I",
    q: "'Inflation targeting' as a framework of monetary policy in India is anchored on which index?",
    options: [
      "Wholesale Price Index (WPI)",
      "Consumer Price Index — Combined (CPI-C)",
      "Index of Industrial Production (IIP)",
      "GDP Deflator"
    ],
    answer: 1,
    explanation: "Under the flexible inflation-targeting framework adopted in 2016, the RBI targets headline Consumer Price Index (Combined) inflation, with a target of 4% within a band of +/- 2%."
  },
  {
    id: "Q2025-ENV-01", subject: "environment", year: 2025, paper: "Prelims GS-I",
    q: "The term 'Green Hydrogen' refers to hydrogen produced by:",
    options: [
      "Steam reforming of natural gas",
      "Electrolysis of water using renewable electricity",
      "Gasification of coal",
      "A by-product of petroleum refining"
    ],
    answer: 1,
    explanation: "Green hydrogen is produced by electrolysis of water powered by renewable energy, resulting in near-zero carbon emissions — unlike grey hydrogen (from natural gas) or brown hydrogen (from coal)."
  },
  {
    id: "Q2025-GEO-01", subject: "geography", year: 2025, paper: "Prelims GS-I",
    q: "Consider the following straits:\n1. Strait of Hormuz\n2. Strait of Malacca\n3. Bab-el-Mandeb\nWhich of the above is/are critical chokepoints for global oil trade?",
    options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
    answer: 3,
    explanation: "All three — the Strait of Hormuz, the Strait of Malacca, and Bab-el-Mandeb — are strategic maritime chokepoints through which a substantial share of global oil and trade flows."
  },
  {
    id: "Q2025-HIS-01", subject: "history", year: 2025, paper: "Prelims GS-I",
    q: "The 'Sangam Age' in ancient South Indian history is associated primarily with which of the following dynasties?",
    options: [
      "Chola, Chera and Pandya",
      "Pallava, Chalukya and Rashtrakuta",
      "Satavahana, Kanva and Shunga",
      "Vijayanagara, Bahmani and Hoysala"
    ],
    answer: 0,
    explanation: "The Sangam Age (roughly 3rd century BCE to 3rd century CE) refers to the early historic period of Tamilakam dominated by the three crowned kings — the Cholas, Cheras, and Pandyas."
  },
  {
    id: "Q2025-SCI-01", subject: "science", year: 2025, paper: "Prelims GS-I",
    q: "With reference to artificial intelligence, a 'Large Language Model' (LLM) is best described as a model that:",
    options: [
      "Stores structured data in relational tables",
      "Is trained on vast text corpora to predict and generate human-like language",
      "Renders 3D graphics in real time",
      "Encrypts data using quantum keys"
    ],
    answer: 1,
    explanation: "A Large Language Model is a neural network trained on very large text datasets to learn statistical patterns of language, enabling it to predict the next token and generate coherent, human-like text."
  },
  {
    id: "Q2025-CUR-01", subject: "currentaff", year: 2025, paper: "Prelims GS-I",
    q: "The 'Unified Lending Interface' (ULI), being promoted by the RBI, is primarily aimed at:",
    options: [
      "Replacing UPI for retail payments",
      "Enabling seamless, consent-based flow of digital information for frictionless credit",
      "Issuing a central bank digital currency",
      "Regulating cryptocurrency exchanges"
    ],
    answer: 1,
    explanation: "The Unified Lending Interface (ULI) is an RBI initiative to enable a standardised, consent-based flow of digital data (such as land records and financial information) to lenders, streamlining and speeding up credit appraisal, especially for small and rural borrowers."
  },
];
