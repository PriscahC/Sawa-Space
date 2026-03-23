Build a USSD session simulator for SawaSpace, a women's legal 
rights and economic empowerment platform in Kenya.

The simulator should look and feel exactly like a real USSD 
session on a Kenyan feature phone — recreating the experience 
of dialing *384*1# on Safaricom.

---

VISUAL DESIGN

Phone frame:
- Render a simple feature phone outline (not a smartphone)
- Dark grey or black plastic casing
- Small rectangular screen — low resolution feel
- Physical number keypad below the screen (0-9, *, #)
- Screen background: black
- Screen text: bright green (#00FF41) monospace font
- Font: Courier New or similar monospace, 13px
- Screen dimensions: approximately 240px wide x 320px tall
- Add a subtle scanline overlay on the screen for realism
- Phone brand label: "SawaSpace Demo" in small muted text 
  on the casing

Input area:
- Below the phone frame, a text input field labeled 
  "Enter reply:" 
- A "Send" button in teal (#1D9E75)
- A "Reset session" link in small muted text
- Show the dialed code above the phone: 
  *384*1# — SawaSpace Legal Triage

---

USSD SCREEN BEHAVIOR

- Each screen displays as plain text, green on black
- Maximum 160 characters per screen (enforce this)
- Screens that continue the session start with "CON"
  — do not show the CON prefix to the user, 
  it is backend logic only
- Screens that end the session start with "END" 
  — show a "Session ended" status below the phone
- Animate text appearing character by character 
  at 18ms per character to simulate real USSD loading
- Show a brief "Connecting..." flash (800ms) 
  between each screen transition
- User input appears at the bottom of the screen 
  as they type, cleared on send

---

FULL SESSION FLOW TO IMPLEMENT

Implement all screens below exactly as written. 
Do not summarize or shorten any screen text.

== SCREEN 0 — ENTRY ==
SawaSpace - Haki Yako
Know your rights at work.

1. English
2. Kiswahili

[Store lang. For this simulation, 
both routes show English screens]

== SCREEN 1 — MAIN MENU ==
SawaSpace
Karibu / Welcome

1. Something happened at work
2. Know my rights
3. Find legal help near me
4. Call SawaSpace helpline
0. Exit

== SCREEN 1.4 — HELPLINE ==
[triggered by input: 4]
FIDA Kenya (free):
0800 720 520

NGEC helpline:
0800 720 419

GVRC (if unsafe):
0719 638 006

SawaSpace: sawaspace.co.ke
Dial *384*1# anytime.
[END SESSION]

== SCREEN 2 — INCIDENT CATEGORY ==
[triggered by input: 1 from main menu]
What happened?
Select the closest:

1. Fired or forced to quit
2. Harassment or abuse
3. Paid less than others
4. Denied leave or benefits
5. Passed over unfairly
6. Other workplace problem

== SCREEN 3A — TERMINATION ==
[triggered by input: 1 from Screen 2]
About your dismissal:

1. Fired without explanation
2. Fired after complaining
3. Forced to resign
4. Made redundant unfairly
5. Contract ended early

== SCREEN 3B — HARASSMENT ==
[triggered by input: 2 from Screen 2]
Type of harassment:

1. Sexual harassment
2. Bullying or intimidation
3. Discrimination (gender)
4. Discrimination (pregnancy)
5. Physical harm or threat

== SCREEN 3C — PAY / BENEFITS ==
[triggered by input: 3 from Screen 2]
More details:

1. Paid less than male colleagues
2. Salary withheld or delayed
3. Maternity leave denied
4. Sick leave denied
5. Benefits given to others not me

== SCREEN 3D — OPPORTUNITY ==
[triggered by input: 5 from Screen 2]
What was denied?

1. Promotion given to less
   qualified person
2. Training I was excluded from
3. Role changed without consent
4. Performance review was unfair

== SCREEN 4 — WHO DID THIS ==
[shown after any Screen 3 selection]
Who is responsible?

1. My direct manager
2. Senior management
3. HR department
4. A colleague
5. The company as a whole

== SCREEN 5 — TIMEFRAME ==
[shown after Screen 4]
When did this happen?

1. Still ongoing
2. In the last 3 months
3. 3 to 12 months ago
4. 1 to 3 years ago
5. More than 3 years ago

== SCREEN 6 — EVIDENCE ==
[shown after Screen 5]
Do you have any of these?

1. Written messages or emails
2. Witnesses who saw it
3. A written complaint made
4. Payslips or contract
5. None of these yet

== SCREEN 7 — RESULT: STRONG CASE ==
[triggered if: sub_type is specific 
AND evidence input is NOT 5 
AND timeframe is 1-4]

Your situation likely has
legal standing in Kenya.

Relevant law:
Employment Act 2007 / S.Offences Act

Your strongest next step:
Document everything today.

1. See full action steps
2. Find help near me
3. Get SMS summary
0. Main menu

== SCREEN 7B — RESULT: POSSIBLE CASE ==
[triggered if: sub_type is specific 
AND evidence input is 5 
AND timeframe is 1-4]

Your situation may have
legal grounds. More evidence
will strengthen your case.

Start here:
Write down every detail today.

1. What evidence to gather
2. Find legal help
3. Get SMS summary
0. Main menu

== SCREEN 7C — RESULT: NEEDS MORE ==
[triggered if: timeframe is 5 
OR sub_type is vague]

Your situation needs more
documentation before filing.

What to do now:
Start a written record today.

1. What to document
2. Know your rights
3. Get SMS summary
0. Main menu

== SCREEN 8 — ACTION STEPS (1 of 3) ==
[triggered by input: 1 from Screen 7]
Step 1 of 3:
Document everything today.
Write date, time, what happened,
who was present.
Keep copies off work devices.

Reply 1 to continue.

== SCREEN 8B — ACTION STEPS (2 of 3) ==
[triggered by input: 1 from Screen 8]
Step 2 of 3:
Report in writing to HR.
Keep a copy of your complaint.
This creates an official record.
Skip if HR is the problem —
go directly to NGEC instead.

Reply 1 to continue.

== SCREEN 8C — ACTION STEPS (3 of 3) ==
[triggered by input: 1 from Screen 8B]
Step 3 of 3:
File externally:
-> NGEC: 0800 720 419 (free)
-> FIDA: 0800 720 520 (free)
-> ELRC if unresolved
   (3yr deadline from incident)

Reply 1 for legal help near me.

== SCREEN 9 — LOCATION ==
[triggered from action steps 
or any "Find help near me" option]
Where are you?

1. Nairobi
2. Mombasa
3. Kisumu
4. Nakuru
5. Other county

== SCREEN 9A — NAIROBI HELP ==
[triggered by input: 1 from Screen 9]
Nairobi legal help:

FIDA Kenya HQ
Lenana Rd, Kilimani
0800 720 520 (free)

NGEC: Upper Hill
0800 720 419 (free)

1. Get SMS with details
0. Main menu

== SCREEN 9B — MOMBASA HELP ==
[triggered by input: 2 from Screen 9]
Mombasa legal help:

FIDA Kenya Mombasa
Nkrumah Rd
0800 720 520 (free)

County Labour Office
Treasury Square

1. Get SMS with details
0. Main menu

== SCREEN 9C — KISUMU HELP ==
[triggered by input: 3 from Screen 9]
Kisumu legal help:

FIDA Kenya Kisumu
Oginga Odinga St
0800 720 520 (free)

County Labour Office
Kisumu CBD

1. Get SMS with details
0. Main menu

== SCREEN 9D — OTHER COUNTY ==
[triggered by input: 4 or 5 from Screen 9]
In your county:

Visit your County Labour
Office (free, handles all
disputes)

FIDA: 0800 720 520
NGEC: 0800 720 419

1. Get SMS with contacts
0. Main menu

== SCREEN 10 — SMS CONFIRM ==
[triggered by any "Get SMS" option]
We will send a free SMS
with your case summary and
contacts to this number.

1. Yes, send SMS
2. Send to different number
0. Cancel

== SCREEN 10B — SMS SENT ==
[triggered by input: 1 from Screen 10]
SMS sent. Check your messages.

Your rights matter.
Haki yako ni muhimu.

Free help anytime:
FIDA: 0800 720 520
[END SESSION]

== SCREEN 11 — KNOW MY RIGHTS ==
[triggered by input: 2 from main menu]
Rights at work in Kenya:

1. Maternity & parental leave
2. Equal pay rights
3. Sexual harassment law
4. Unfair dismissal rights
5. Contract rights

== SCREEN 11A — MATERNITY ==
[triggered by input: 1 from Screen 11]
Employment Act 2007:

- 3 months paid maternity leave
- Cannot be fired for pregnancy
- Must return to same role
- Breastfeeding breaks required

1. Mine were denied - get help
0. Back

== SCREEN 11B — EQUAL PAY ==
[triggered by input: 2 from Screen 11]
Constitution Art.27 +
Employment Act 2007:

- Equal pay for equal work
- No pay cuts for taking leave
- Right to know salary range
- Right to query your payslip

1. I am being paid less
0. Back

== SCREEN 11C — HARASSMENT LAW ==
[triggered by input: 3 from Screen 11]
Sexual Offences Act 2006
+ Employment Act S.6:

- Unwanted sexual conduct
  at work is illegal
- Employer must have a policy
- You can report safely

1. This happened to me
0. Back

== SCREEN 11D — DISMISSAL ==
[triggered by input: 4 from Screen 11]
Employment Act 2007:

- Must receive written reason
- Must get notice or pay in lieu
- Challenge at ELRC: 3yr limit
- Pregnancy dismissal = illegal

1. I was dismissed unfairly
0. Back

== SCREEN 0 EXIT ==
[triggered by input: 0 from main menu]
Thank you for using
SawaSpace.

Your rights matter.
Haki yako ni muhimu.

Free help anytime:
FIDA: 0800 720 520

Dial *384*1# to return.
[END SESSION]

---

SIDEBAR PANEL (next to the phone)

Show a live session state panel 
with the following fields, 
updating in real time as user 
navigates:

Session ID: [random 6-char alphanumeric]
Status: Active / Ended
Language: English / Kiswahili
Category: [updates as selected]
Sub-type: [updates as selected]
Perpetrator: [updates as selected]
Timeframe: [updates as selected]
Evidence: [updates as selected]
Viability: [STRONG / POSSIBLE / 
            NEEDS MORE / Pending]

Style the panel in clean white card, 
teal left border (#1D9E75), 
monospace font for values, 
muted label text.
Title: "Live Session State"

---

DEMO SCENARIO BUTTON

Above the phone, add a row of 
three preset demo scenario buttons:

1. "Sexual Harassment" — 
   auto-plays: 1 > 1 > 2 > 1 > 1 > 2 > 2
   (English, incident, harassment, 
   sexual, manager, ongoing, messages)

2. "Unfair Dismissal" — 
   auto-plays: 1 > 1 > 1 > 1 > 2 > 3 > 1
   (English, incident, termination, 
   no explanation, management, 
   3-12 months, complaint made)

3. "Maternity Rights" — 
   auto-plays: 1 > 2 > 1
   (English, know my rights, maternity)

Each button plays the sequence 
with 1.2 second delays between 
inputs so judges can follow along.
Add a "Pause" and "Reset" control.

---

BOTTOM STATUS BAR

Below the phone frame show:
- Character count of current screen 
  (e.g. "143 / 160 chars")
- Screen ID (e.g. "Screen 3B")
- A small green dot + "Session active" 
  or red dot + "Session ended"
- Network label: "Safaricom KE" 
  with signal bars icon

---

TECH NOTES FOR LOVABLE

- Build as a single React component
- All session state in useState
- Session routing via a screenMap 
  object keyed by screen ID
- Viability logic as a pure function: 
  getViability(category, subType, 
  timeframe, evidence) => tier
- Typewriter animation via 
  useEffect + setInterval
- Demo scenario auto-play via 
  async/await with setTimeout delays
- No external API calls needed — 
  fully self-contained simulation
- Mobile responsive: on small screens, 
  stack phone above session panel
- Teal: #1D9E75, Coral: #D85A30, 
  Screen green: #00FF41, 
  Background: #0a0a0a for phone casing
