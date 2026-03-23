/**
 * SawaSpace USSD Handler
 * Built for Africa's Talking USSD Gateway
 * Shortcode: *384*1#
 *
 * Usage: Express.js POST endpoint
 * AT sends: sessionId, serviceCode, phoneNumber, text
 * We respond with: CON (continue) or END (terminate)
 */

const express = require("express");
const router = express.Router();

// ─── Session Store (use Redis in production) ────────────────────────────────
const sessions = {};

function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      lang: "en",
      step: "ENTRY",
      category: null,
      subType: null,
      perpetrator: null,
      timeframe: null,
      evidence: [],
      location: null,
      phone: null,
    };
  }
  return sessions[sessionId];
}

function clearSession(sessionId) {
  delete sessions[sessionId];
}

// ─── Viability Logic ────────────────────────────────────────────────────────
function getViability(category, subType, timeframe, evidence) {
  if (timeframe === "5") return "NEEDS_MORE";
  if (!subType) return "NEEDS_MORE";
  const hasEvidence = evidence.length > 0 && !evidence.includes("5");
  if (hasEvidence) return "STRONG";
  return "POSSIBLE";
}

// ─── Legal Resource by Category ─────────────────────────────────────────────
function getPrimaryResource(category) {
  const resources = {
    "1": "ELRC: 3yr deadline from incident\nLabour Office: free mediation",
    "2": "NGEC: 0800 720 419 (free)\nFIDA: 0800 720 520 (free)",
    "3": "NGEC: 0800 720 419\nELRC: elrc.go.ke",
    "4": "NGEC: 0800 720 419\nFIDA: 0800 720 520 (free)",
    "5": "ELRC: wrongful demotion\nFIDA: 0800 720 520",
    "6": "Labour Office: your county\nFIDA: 0800 720 520",
  };
  return resources[category] || "FIDA: 0800 720 520 (free)\nNGEC: 0800 720 419";
}

// ─── Location Resources ──────────────────────────────────────────────────────
function getLocationResource(location) {
  const locations = {
    "1": "FIDA Kenya HQ\nLenana Rd, Kilimani\n0800 720 520 (free)\n\nNGEC: Upper Hill\n0800 720 419 (free)",
    "2": "FIDA Kenya Mombasa\nNkrumah Rd\n0800 720 520 (free)\n\nCounty Labour Office\nTreasury Square",
    "3": "FIDA Kenya Kisumu\nOginga Odinga St\n0800 720 520 (free)\n\nCounty Labour Office\nKisumu CBD",
    "4": "County Labour Office\nNakuru CBD (free)\n\nFIDA: 0800 720 520\nNGEC: 0800 720 419",
    "5": "Visit your County\nLabour Office (free)\n\nFIDA: 0800 720 520\nNGEC: 0800 720 419",
  };
  return locations[location] || locations["5"];
}

// ─── Screen Builders ─────────────────────────────────────────────────────────
const screens = {
  ENTRY: () =>
    `CON SawaSpace - Haki Yako\nKnow your rights at work.\n\n1. English\n2. Kiswahili`,

  MAIN_MENU: () =>
    `CON SawaSpace\nKaribu / Welcome\n\n1. Something happened at work\n2. Know my rights\n3. Find legal help near me\n4. Call SawaSpace helpline\n0. Exit`,

  HELPLINE: () =>
    `END FIDA Kenya (free):\n0800 720 520\n\nNGEC helpline:\n0800 720 419\n\nGVRC (if unsafe):\n0719 638 006\n\nDial *384*1# anytime.`,

  INCIDENT_CATEGORY: () =>
    `CON What happened?\nSelect the closest:\n\n1. Fired or forced to quit\n2. Harassment or abuse\n3. Paid less than others\n4. Denied leave or benefits\n5. Passed over unfairly\n6. Other workplace problem`,

  // Subcategory screens
  SUB_TERMINATION: () =>
    `CON About your dismissal:\n\n1. Fired without explanation\n2. Fired after complaining\n3. Forced to resign\n4. Made redundant unfairly\n5. Contract ended early`,

  SUB_HARASSMENT: () =>
    `CON Type of harassment:\n\n1. Sexual harassment\n2. Bullying or intimidation\n3. Discrimination (gender)\n4. Discrimination (pregnancy)\n5. Physical harm or threat`,

  SUB_PAY: () =>
    `CON More details:\n\n1. Paid less than male colleagues\n2. Salary withheld or delayed\n3. Maternity leave denied\n4. Sick leave denied\n5. Benefits given to others not me`,

  SUB_LEAVE: () =>
    `CON What was denied:\n\n1. Maternity leave\n2. Sick leave\n3. Annual leave\n4. Paternity leave\n5. Breastfeeding breaks`,

  SUB_OPPORTUNITY: () =>
    `CON What was denied?\n\n1. Promotion given to less\n   qualified person\n2. Training I was excluded from\n3. Role changed without consent\n4. Performance review was unfair`,

  SUB_OTHER: () =>
    `CON Which best describes it?\n\n1. Contract not honoured\n2. References withheld unfairly\n3. Workplace is unsafe\n4. Privacy violated at work\n5. None of the above`,

  WHO: () =>
    `CON Who is responsible?\n\n1. My direct manager\n2. Senior management\n3. HR department\n4. A colleague\n5. The company as a whole`,

  TIMEFRAME: () =>
    `CON When did this happen?\n\n1. Still ongoing\n2. In the last 3 months\n3. 3 to 12 months ago\n4. 1 to 3 years ago\n5. More than 3 years ago`,

  EVIDENCE: () =>
    `CON Do you have any of these?\n(Enter all that apply e.g. 124)\n\n1. Written messages or emails\n2. Witnesses who saw it\n3. A written complaint made\n4. Payslips or contract\n5. None of these yet`,

  // Viability result screens
  RESULT_STRONG: (session) =>
    `CON Your situation likely has\nlegal standing in Kenya.\n\nRelevant law:\n${getLaw(session.category)}\n\n1. See full action steps\n2. Find help near me\n3. Get SMS summary\n0. Main menu`,

  RESULT_POSSIBLE: () =>
    `CON Your situation may have\nlegal grounds. More evidence\nwill strengthen your case.\n\n1. What evidence to gather\n2. Find legal help\n3. Get SMS summary\n0. Main menu`,

  RESULT_NEEDS_MORE: () =>
    `CON Your situation needs more\ndocumentation before filing.\n\n1. What to document\n2. Know your rights\n3. Get SMS summary\n0. Main menu`,

  // Action steps
  ACTION_1: () =>
    `CON Step 1 of 3:\nDocument everything today.\nWrite date, time, what happened,\nwho was present.\nKeep copies off work devices.\n\nReply 1 to continue.`,

  ACTION_2: (session) =>
    session.perpetrator === "3"
      ? `CON Step 2 of 3:\nSkip internal HR report.\nGo directly to NGEC or\na County Labour Officer.\nThey handle cases where\nHR is involved.\n\nReply 1 to continue.`
      : `CON Step 2 of 3:\nReport in writing to HR.\nKeep a copy of your complaint.\nThis creates an official record.\nDo this before going external.\n\nReply 1 to continue.`,

  ACTION_3: (session) =>
    `CON Step 3 of 3:\nFile externally:\n${getPrimaryResource(session.category)}\n\nReply 1 for legal help\nnear you.`,

  EVIDENCE_GUIDANCE: () =>
    `CON Gather these if you can:\n\n- Written record of incidents\n- Any messages from the person\n- Names of witnesses\n- Your contract or offer letter\n- Payslips if pay-related\n\n1. Find legal help\n2. Get SMS summary\n0. Main menu`,

  LOCATION: () =>
    `CON Where are you?\n\n1. Nairobi\n2. Mombasa\n3. Kisumu\n4. Nakuru\n5. Other county`,

  LOCAL_HELP: (session) =>
    `CON ${getLocationResource(session.location)}\n\n1. Get SMS with details\n0. Main menu`,

  // Know your rights
  RIGHTS_MENU: () =>
    `CON Rights at work in Kenya:\n\n1. Maternity & parental leave\n2. Equal pay rights\n3. Sexual harassment law\n4. Unfair dismissal rights\n5. Contract rights`,

  RIGHTS_MATERNITY: () =>
    `CON Employment Act 2007:\n\n- 3 months paid maternity leave\n- Cannot be fired for pregnancy\n- Must return to same role\n- Breastfeeding breaks required\n\n1. Mine were denied - get help\n0. Back`,

  RIGHTS_PAY: () =>
    `CON Constitution Art.27 +\nEmployment Act 2007:\n\n- Equal pay for equal work\n- No pay cuts for taking leave\n- Right to know salary range\n- Right to query your payslip\n\n1. I am being paid less\n0. Back`,

  RIGHTS_HARASSMENT: () =>
    `CON Sexual Offences Act 2006\n+ Employment Act S.6:\n\n- Unwanted sexual conduct\n  at work is illegal\n- Employer must have a policy\n- You can report safely\n\n1. This happened to me\n0. Back`,

  RIGHTS_DISMISSAL: () =>
    `CON Employment Act 2007:\n\n- Must receive written reason\n- Must get notice or pay in lieu\n- Challenge at ELRC: 3yr limit\n- Pregnancy dismissal = illegal\n\n1. I was dismissed unfairly\n0. Back`,

  RIGHTS_CONTRACT: () =>
    `CON Employment Act 2007:\n\n- Written contract required\n- Cannot change terms without\n  your written agreement\n- Verbal agreements are valid\n- Probation max 6 months\n\n1. My contract was violated\n0. Back`,

  // SMS screens
  SMS_CONFIRM: () =>
    `CON We will send a free SMS\nwith your case summary and\ncontacts to this number.\n\n1. Yes, send SMS\n2. Send to different number\n0. Cancel`,

  SMS_SENT: () =>
    `END SMS sent. Check your messages.\n\nYour rights matter.\nHaki yako ni muhimu.\n\nFree help:\nFIDA: 0800 720 520\n\nDial *384*1# anytime.`,

  EXIT: () =>
    `END Thank you for using\nSawaSpace.\n\nYour rights matter.\nHaki yako ni muhimu.\n\nFree help:\nFIDA: 0800 720 520\n\nDial *384*1# to return.`,
};

// ─── Helper: Law by Category ─────────────────────────────────────────────────
function getLaw(category) {
  const laws = {
    "1": "Employment Act 2007",
    "2": "Sexual Offences Act 2006",
    "3": "Constitution Art.27 / Employment Act",
    "4": "Employment Act 2007 S.29",
    "5": "Employment Act 2007",
    "6": "Employment Act 2007",
  };
  return laws[category] || "Employment Act 2007";
}

// ─── Helper: SMS Content ─────────────────────────────────────────────────────
function buildSMSContent(session) {
  const categoryLabels = {
    "1": "Wrongful Termination",
    "2": "Harassment / Abuse",
    "3": "Unequal Pay",
    "4": "Denied Benefits",
    "5": "Missed Opportunity",
    "6": "Workplace Violation",
  };
  const viabilityLabels = {
    STRONG: "Strong case — act now",
    POSSIBLE: "Possible case — gather evidence",
    NEEDS_MORE: "Document more before filing",
  };
  const viability = getViability(
    session.category,
    session.subType,
    session.timeframe,
    session.evidence
  );
  return (
    `SawaSpace - Your Rights Summary\n` +
    `Incident: ${categoryLabels[session.category] || "Workplace violation"}\n` +
    `Status: ${viabilityLabels[viability]}\n\n` +
    `Free legal help:\n` +
    `FIDA: 0800 720 520\n` +
    `NGEC: 0800 720 419\n\n` +
    `Time limit: File within 3 years\n\n` +
    `sawaspace.co.ke\n` +
    `*384*1# to continue.`
  );
}

// ─── Main USSD Router ────────────────────────────────────────────────────────
router.post("/ussd", (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const session = getSession(sessionId);
  session.phone = phoneNumber;

  // Parse input sequence
  const inputs = text ? text.split("*") : [];
  const lastInput = inputs[inputs.length - 1] || "";

  let response = "";

  // ── Step: ENTRY ────────────────────────────────────────────────────────────
  if (text === "") {
    session.step = "ENTRY";
    response = screens.ENTRY();
  }

  // ── Step: LANGUAGE SELECT ──────────────────────────────────────────────────
  else if (session.step === "ENTRY" || inputs.length === 1) {
    session.lang = lastInput === "2" ? "sw" : "en";
    session.step = "MAIN_MENU";
    response = screens.MAIN_MENU();
  }

  // ── Step: MAIN MENU ────────────────────────────────────────────────────────
  else if (session.step === "MAIN_MENU" || inputs.length === 2) {
    const choice = inputs[1];
    if (choice === "1") {
      session.step = "INCIDENT_CATEGORY";
      response = screens.INCIDENT_CATEGORY();
    } else if (choice === "2") {
      session.step = "RIGHTS_MENU";
      response = screens.RIGHTS_MENU();
    } else if (choice === "3") {
      session.step = "LOCATION";
      response = screens.LOCATION();
    } else if (choice === "4") {
      clearSession(sessionId);
      response = screens.HELPLINE();
    } else if (choice === "0") {
      clearSession(sessionId);
      response = screens.EXIT();
    } else {
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: INCIDENT CATEGORY ────────────────────────────────────────────────
  else if (session.step === "INCIDENT_CATEGORY" || inputs.length === 3) {
    session.category = inputs[2];
    session.step = "SUBCATEGORY";
    const subScreens = {
      "1": screens.SUB_TERMINATION,
      "2": screens.SUB_HARASSMENT,
      "3": screens.SUB_PAY,
      "4": screens.SUB_LEAVE,
      "5": screens.SUB_OPPORTUNITY,
      "6": screens.SUB_OTHER,
    };
    response = (subScreens[session.category] || screens.SUB_OTHER)();
  }

  // ── Step: SUBCATEGORY ──────────────────────────────────────────────────────
  else if (session.step === "SUBCATEGORY" || inputs.length === 4) {
    session.subType = inputs[3];
    session.step = "WHO";
    response = screens.WHO();
  }

  // ── Step: WHO ──────────────────────────────────────────────────────────────
  else if (session.step === "WHO" || inputs.length === 5) {
    session.perpetrator = inputs[4];
    session.step = "TIMEFRAME";
    response = screens.TIMEFRAME();
  }

  // ── Step: TIMEFRAME ────────────────────────────────────────────────────────
  else if (session.step === "TIMEFRAME" || inputs.length === 6) {
    session.timeframe = inputs[5];
    session.step = "EVIDENCE";
    response = screens.EVIDENCE();
  }

  // ── Step: EVIDENCE ─────────────────────────────────────────────────────────
  else if (session.step === "EVIDENCE" || inputs.length === 7) {
    // Parse multi-digit evidence input e.g. "124"
    session.evidence = inputs[6].split("").filter((c) => /[1-5]/.test(c));
    session.step = "RESULT";

    const viability = getViability(
      session.category,
      session.subType,
      session.timeframe,
      session.evidence
    );

    if (viability === "STRONG") {
      session.step = "RESULT_STRONG";
      response = screens.RESULT_STRONG(session);
    } else if (viability === "POSSIBLE") {
      session.step = "RESULT_POSSIBLE";
      response = screens.RESULT_POSSIBLE();
    } else {
      session.step = "RESULT_NEEDS_MORE";
      response = screens.RESULT_NEEDS_MORE();
    }
  }

  // ── Step: RESULT STRONG ────────────────────────────────────────────────────
  else if (session.step === "RESULT_STRONG") {
    if (lastInput === "1") {
      session.step = "ACTION_1";
      response = screens.ACTION_1();
    } else if (lastInput === "2") {
      session.step = "LOCATION";
      response = screens.LOCATION();
    } else if (lastInput === "3") {
      session.step = "SMS_CONFIRM";
      response = screens.SMS_CONFIRM();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: RESULT POSSIBLE ──────────────────────────────────────────────────
  else if (session.step === "RESULT_POSSIBLE") {
    if (lastInput === "1") {
      session.step = "EVIDENCE_GUIDANCE";
      response = screens.EVIDENCE_GUIDANCE();
    } else if (lastInput === "2") {
      session.step = "LOCATION";
      response = screens.LOCATION();
    } else if (lastInput === "3") {
      session.step = "SMS_CONFIRM";
      response = screens.SMS_CONFIRM();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: RESULT NEEDS MORE ────────────────────────────────────────────────
  else if (session.step === "RESULT_NEEDS_MORE") {
    if (lastInput === "1") {
      session.step = "EVIDENCE_GUIDANCE";
      response = screens.EVIDENCE_GUIDANCE();
    } else if (lastInput === "2") {
      session.step = "RIGHTS_MENU";
      response = screens.RIGHTS_MENU();
    } else if (lastInput === "3") {
      session.step = "SMS_CONFIRM";
      response = screens.SMS_CONFIRM();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: ACTION STEPS ─────────────────────────────────────────────────────
  else if (session.step === "ACTION_1") {
    if (lastInput === "1") {
      session.step = "ACTION_2";
      response = screens.ACTION_2(session);
    }
  } else if (session.step === "ACTION_2") {
    if (lastInput === "1") {
      session.step = "ACTION_3";
      response = screens.ACTION_3(session);
    }
  } else if (session.step === "ACTION_3") {
    if (lastInput === "1") {
      session.step = "LOCATION";
      response = screens.LOCATION();
    }
  }

  // ── Step: EVIDENCE GUIDANCE ────────────────────────────────────────────────
  else if (session.step === "EVIDENCE_GUIDANCE") {
    if (lastInput === "1") {
      session.step = "LOCATION";
      response = screens.LOCATION();
    } else if (lastInput === "2") {
      session.step = "SMS_CONFIRM";
      response = screens.SMS_CONFIRM();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: LOCATION ─────────────────────────────────────────────────────────
  else if (session.step === "LOCATION") {
    session.location = lastInput;
    session.step = "LOCAL_HELP";
    response = screens.LOCAL_HELP(session);
  }

  // ── Step: LOCAL HELP ───────────────────────────────────────────────────────
  else if (session.step === "LOCAL_HELP") {
    if (lastInput === "1") {
      session.step = "SMS_CONFIRM";
      response = screens.SMS_CONFIRM();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Step: RIGHTS MENU ──────────────────────────────────────────────────────
  else if (session.step === "RIGHTS_MENU") {
    const rightsScreens = {
      "1": "RIGHTS_MATERNITY",
      "2": "RIGHTS_PAY",
      "3": "RIGHTS_HARASSMENT",
      "4": "RIGHTS_DISMISSAL",
      "5": "RIGHTS_CONTRACT",
    };
    session.step = rightsScreens[lastInput] || "RIGHTS_MENU";
    response = screens[session.step]();
  }

  // ── Step: RIGHTS DETAIL SCREENS ───────────────────────────────────────────
  else if (
    [
      "RIGHTS_MATERNITY",
      "RIGHTS_PAY",
      "RIGHTS_HARASSMENT",
      "RIGHTS_DISMISSAL",
      "RIGHTS_CONTRACT",
    ].includes(session.step)
  ) {
    if (lastInput === "1") {
      // Route to incident flow with relevant category pre-set
      const categoryMap = {
        RIGHTS_MATERNITY: "4",
        RIGHTS_PAY: "3",
        RIGHTS_HARASSMENT: "2",
        RIGHTS_DISMISSAL: "1",
        RIGHTS_CONTRACT: "6",
      };
      session.category = categoryMap[session.step];
      session.step = "SUBCATEGORY";
      const subScreens = {
        "4": screens.SUB_LEAVE,
        "3": screens.SUB_PAY,
        "2": screens.SUB_HARASSMENT,
        "1": screens.SUB_TERMINATION,
        "6": screens.SUB_OTHER,
      };
      response = subScreens[session.category]();
    } else if (lastInput === "0") {
      session.step = "RIGHTS_MENU";
      response = screens.RIGHTS_MENU();
    }
  }

  // ── Step: SMS CONFIRM ──────────────────────────────────────────────────────
  else if (session.step === "SMS_CONFIRM") {
    if (lastInput === "1") {
      // Send SMS via Africa's Talking
      sendSMS(session.phone, buildSMSContent(session));
      clearSession(sessionId);
      response = screens.SMS_SENT();
    } else if (lastInput === "0") {
      session.step = "MAIN_MENU";
      response = screens.MAIN_MENU();
    }
  }

  // ── Fallback ───────────────────────────────────────────────────────────────
  else {
    session.step = "MAIN_MENU";
    response = screens.MAIN_MENU();
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// ─── SMS Sender (Africa's Talking) ──────────────────────────────────────────
async function sendSMS(phone, message) {
  const AfricasTalking = require("africastalking");
  const at = AfricasTalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
  });
  try {
    await at.SMS.send({
      to: [phone],
      message,
      from: "SawaSpace",
    });
    console.log(`SMS sent to ${phone}`);
  } catch (err) {
    console.error("SMS send error:", err);
  }
}

module.exports = router;

// ─── Server Entry Point ──────────────────────────────────────────────────────
if (require.main === module) {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use("/", router);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`SawaSpace USSD server running on port ${PORT}`);
    console.log(`POST http://localhost:${PORT}/ussd`);
  });
}
