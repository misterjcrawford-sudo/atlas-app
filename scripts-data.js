window.ATLAS_CATEGORIES = [
  {
    "id": "family",
    "label": "Family",
    "description": "Parents, siblings, your ex's family — the people closest to the fallout.",
    "count": 10
  },
  {
    "id": "your-ex",
    "label": "Your Ex",
    "description": "Logistics, money, kids, schedules, and the hard conversations in between.",
    "count": 12
  },
  {
    "id": "work",
    "label": "Work",
    "description": "Telling your employer, managing availability, performance, and leave.",
    "count": 7
  },
  {
    "id": "finances-legal",
    "label": "Finances & Legal",
    "description": "Lawyers, accountants, banks, debt, and the asset split.",
    "count": 7
  },
  {
    "id": "social-friends",
    "label": "Social & Friends",
    "description": "Who to tell, how to tell them, and which friendships will survive.",
    "count": 8
  },
  {
    "id": "kids-world",
    "label": "Your Kids' World",
    "description": "Schools, coaches, events — managing the practical world around your kids.",
    "count": 5
  },
  {
    "id": "new-relationships",
    "label": "New Relationships",
    "description": "Telling your kids, introducing someone new, and setting realistic expectations.",
    "count": 5
  },
  {
    "id": "wellbeing",
    "label": "Health & Wellbeing",
    "description": "GPs, therapy, crisis lines, and telling a mate you're not doing well.",
    "count": 5
  },
  {
    "id": "admin",
    "label": "Practical Admin",
    "description": "Landlords, Centrelink, real estate agents, utilities.",
    "count": 4
  },
  {
    "id": "high-stakes",
    "label": "Higher-Stakes",
    "description": "Relocation, parenting orders, court, and the conversations that can't wait.",
    "count": 5
  }
];

window.ATLAS_SCRIPTS = [
  {
    "id": "telling-your-parents-youve-separated",
    "category": "family",
    "number": 1,
    "title": "Telling your parents you've separated",
    "situation": "You need to tell your parent(s) that your relationship has ended. The goal isn't to get their opinion — it's to inform them, set the tone, and keep them from panicking or overcorrecting.",
    "before": [
      "Decide what you're comfortable sharing. You don't owe them the full story.",
      "Tell them in person or by phone — not by text or group message.",
      "Have a rough sense of your immediate plan (where you're living, what's happening with the kids) so you can answer the basic questions.",
      "If your parents are divorced themselves, be ready for them to project. It happens."
    ],
    "opening": "I need to tell you something. [Partner's name] and I have separated. It's been a hard few weeks but I wanted you to hear it from me.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The basics first",
        "example": "We're still working out the practical side — where I'm living, how the kids' time will split. I'll keep you updated as things get clearer."
      },
      {
        "heading": "What you need from them",
        "example": "I'm not looking for advice right now. I just needed you to know. The best thing you can do is be normal with me."
      },
      {
        "heading": "The kids (if relevant)",
        "example": "The kids don't know yet / The kids know. They're okay. I'll let you know when we're ready for them to see you."
      }
    ],
    "sideways": [
      {
        "trigger": "If they ask whose fault it was",
        "response": "I'm not going into that. What matters now is sorting the practical stuff."
      },
      {
        "trigger": "If they immediately take sides or attack your ex",
        "response": "I need you to be careful with that. [Ex's name] is still my kids' other parent. That doesn't help."
      },
      {
        "trigger": "If they get upset and make it about them",
        "response": "I know this is hard to hear. I'll keep you in the loop. But right now I need to go."
      }
    ],
    "close": "End with a clear next step. \"I'll call you in a few days when I know more.\" Not open-ended — they need a timeline or they'll fill the gap with calls."
  },
  {
    "id": "telling-your-kids-under-5",
    "category": "family",
    "number": 2,
    "title": "Telling your kids (under 5)",
    "situation": "Children under 5 don't need a full explanation of separation. They need to know they're safe, they're loved, and what their daily life is going to look like. Keep it concrete and keep it short.",
    "before": [
      "Do this together with your co-parent if at all possible. A unified message is worth more than any perfect wording.",
      "Don't explain why. Under 5s don't have the capacity to process relationship dynamics — it will confuse them, not help them.",
      "Have an answer ready for: \"Where will I sleep?\" and \"Will I still see [parent]?",
      "Pick a quiet moment — not bedtime, not right before a transition."
    ],
    "opening": "We want to tell you something. Mummy and Daddy / [names] aren't going to live in the same house anymore. We're going to have two homes.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "They will still see both of you",
        "example": "You're going to spend time with Mum and time with Dad. You'll still see both of us all the time."
      },
      {
        "heading": "Their life stays the same",
        "example": "You'll still go to [daycare / school]. You'll still see [grandparents / friends]. All of that stays the same."
      },
      {
        "heading": "It's not their fault",
        "example": "This has nothing to do with anything you did. We both love you exactly the same."
      }
    ],
    "sideways": [
      {
        "trigger": "If they seem confused and keep asking why",
        "response": "It's grown-up stuff. The important thing is that nothing changes for you."
      },
      {
        "trigger": "If they get upset or cry",
        "response": "Sit with it. Don't rush to fix it. \"It's okay to feel sad. We're both right here."
      },
      {
        "trigger": "If they seem totally unfazed",
        "response": "That's normal at this age. Don't over-explain. Let it land slowly."
      }
    ],
    "close": "Return to routine as quickly as possible. The fastest way to reassure a child under 5 is to show them the structure of their day is still intact."
  },
  {
    "id": "telling-your-kids-5-10",
    "category": "family",
    "number": 3,
    "title": "Telling your kids (5–10)",
    "situation": "Children 5–10 will ask more questions, feel more, and may worry that they caused it. They need the same reassurance as younger kids — plus a bit more explanation, but not too much. Keep it factual and keep it brief.",
    "before": [
      "Do this together if you can. If not, tell them at roughly the same time, same message.",
      "Agree in advance on what you're saying and what you're not saying.",
      "Don't blame each other. Even if one of you is entirely at fault, the kids don't need to hold that.",
      "Be ready for: \"Are you going to get back together?\" The honest answer is no. Say it kindly, once."
    ],
    "opening": "We want to talk to you about something. Our family is going to change a bit. Mum and Dad / [names] aren't going to be together anymore, and we won't all live in the same house.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Both homes, still a family",
        "example": "You're going to have two homes. You'll live with [parent] some of the time and [parent] the other time. We'll work out a schedule and tell you exactly what it looks like."
      },
      {
        "heading": "Nothing about you changed",
        "example": "This has nothing to do with you. It's not because of anything you did or said. We love you exactly the same."
      },
      {
        "heading": "They can ask anything",
        "example": "You can ask us anything you want. There might be things we don't know yet — we'll tell you as we work them out."
      }
    ],
    "sideways": [
      {
        "trigger": "If they ask if you'll get back together",
        "response": "No. But we're both still your parents. That doesn't change."
      },
      {
        "trigger": "If they get angry at one parent",
        "response": "Don't encourage it, don't dismiss it. \"I know you're upset. That makes sense."
      },
      {
        "trigger": "If they get very quiet or shut down",
        "response": "You don't have to say anything. We can talk more later.\" And come back to it."
      }
    ],
    "close": "Give them something concrete: \"Tonight you're staying here. Tomorrow we'll show you what the schedule looks like.\" The uncertainty is what frightens them — close the loop on whatever you can."
  },
  {
    "id": "telling-your-kids-teenagers",
    "category": "family",
    "number": 4,
    "title": "Telling your kids (teenagers)",
    "situation": "Teenagers will likely have suspected something. They may have opinions, push back, withdraw, or take a side. The goal is to tell them plainly, give them space to react, and avoid getting drawn into relationship politics.",
    "before": [
      "Do this together if you can, but don't force an artificial united front if the relationship is hostile — they'll see through it.",
      "Don't over-explain. Teenagers are smart. Short and clear is more respectful than a long performance.",
      "Expect them to have thoughts about the decision. You don't have to agree or defend. Listen first.",
      "Make it clear you're not looking for their approval — but you do want to hear how they're feeling."
    ],
    "opening": "I want to talk to you about something important. [Partner] and I have decided to separate. We're not going to be together anymore, and the living arrangements are going to change.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The practical reality",
        "example": "Here's what it looks like for now: [where each parent is living, rough schedule]. Things may shift as we work out the details — I'll keep you in the loop."
      },
      {
        "heading": "Their relationship with both parents",
        "example": "Your relationship with both of us stays yours. I'm not going to tell you how to feel about this, and neither of us is going to put you in the middle."
      },
      {
        "heading": "You're not asking for their blessing",
        "example": "I'm telling you because you deserve to know — not because we need you to say it's okay."
      }
    ],
    "sideways": [
      {
        "trigger": "If they get angry or blame one parent",
        "response": "I get it. You're allowed to be angry. I'm not going to argue about fault right now."
      },
      {
        "trigger": "If they say they already knew",
        "response": "I imagine it's been hard watching that. I'm sorry we didn't do this sooner."
      },
      {
        "trigger": "If they shut down and leave",
        "response": "Give them space. Come back in an hour. Don't chase the conversation."
      }
    ],
    "close": "Let them have the last word if they want it. End with: \"I'm here when you want to talk. No rush.\" Then follow through when they come to you."
  },
  {
    "id": "when-a-parent-takes-sides",
    "category": "family",
    "number": 5,
    "title": "When a parent takes sides",
    "situation": "Your parent is actively criticising your ex, undermining your co-parenting, or turning family gatherings into a debrief on the separation. You need to shut it down without blowing up the relationship.",
    "before": [
      "Be clear on what you actually need from them. Not validation — cooperation.",
      "Know that this behaviour usually comes from protectiveness and helplessness, not malice. Name that to yourself before the conversation.",
      "Do this privately, not at a family event."
    ],
    "opening": "I need to ask you to do something differently. When you criticise [ex's name] in front of me — or in front of the kids — it makes things harder, not easier. I need that to stop.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Why it matters practically",
        "example": "[Ex] is my kids' other parent. Every time you undermine them, it puts me in a difficult position with my kids."
      },
      {
        "heading": "What you need from them",
        "example": "I need you to be a steady presence for me — not another person I have to manage. That means keeping your opinions about [ex] to yourself unless I ask."
      },
      {
        "heading": "You still want them in your corner",
        "example": "I know you're trying to help. The best way to do that is to let me handle this."
      }
    ],
    "sideways": [
      {
        "trigger": "If they get defensive and say they're just being honest",
        "response": "I know. But I'm not asking for honesty about [ex]. I'm asking for support for me."
      },
      {
        "trigger": "If they escalate and double down",
        "response": "I mean it. If this keeps happening, I'm going to stop bringing the kids around when you're like this."
      },
      {
        "trigger": "If they get upset or tearful",
        "response": "I'm not angry at you. I just need this to change."
      }
    ],
    "close": "End clearly: \"I just need to know you'll try.\" If they agree, move on. If they won't, you'll know what you're dealing with."
  },
  {
    "id": "asking-a-parent-for-financial-help",
    "category": "family",
    "number": 6,
    "title": "Asking a parent for financial help",
    "situation": "You need money — a short-term loan, help covering bond on a new place, bridging finance while the settlement works out. You need to ask a parent without it becoming a recurring conversation or a condition.",
    "before": [
      "Know the exact number. \"Some help\" is too vague and opens the floor to negotiation you didn't invite.",
      "Know how you intend to repay it. Even if you're not certain you can, have a plan to offer.",
      "Be clear it's a loan, not a gift — unless they insist otherwise.",
      "Choose your moment. Not at a family dinner."
    ],
    "opening": "I need to ask you something I'm not very comfortable asking. I'm stretched at the moment and I need some help to cover [bond / move / gap]. I'm asking to borrow $[amount]. I'll pay it back by [timeframe].",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What it's for",
        "example": "It's to cover [specific thing]. Without it I'm in a bad spot for the next [period]."
      },
      {
        "heading": "The terms you're proposing",
        "example": "I'd like to treat it as a proper loan. If you're willing, I'll pay you back [monthly / by date]."
      },
      {
        "heading": "What you're not asking for",
        "example": "I'm not asking for advice about the separation or my finances. Just this."
      }
    ],
    "sideways": [
      {
        "trigger": "If they want to discuss the separation first",
        "response": "I'd rather not mix those two conversations. Can we just deal with this one?"
      },
      {
        "trigger": "If they want to give it as a gift when you'd prefer a loan",
        "response": "I appreciate that. I'd still feel better treating it as a loan."
      },
      {
        "trigger": "If they say no",
        "response": "That's okay. I'll work something else out.\" Don't push. Have a backup."
      }
    ],
    "close": "If they say yes: agree on the amount, the timeline, and whether it's written down. \"I'll send you a message with the details so we're both clear."
  },
  {
    "id": "asking-a-parent-to-help-with-childcare",
    "category": "family",
    "number": 7,
    "title": "Asking a parent to help with childcare",
    "situation": "You need your parent to take the kids — school pickup, a night, a few days — during your custody period. You need to ask clearly without it turning into a long conversation about how you're coping.",
    "before": [
      "Be specific. Date, time, how long.",
      "Have a plan for what they'd need — food, medication, activities.",
      "Know what you're doing while they have the kids. You don't have to share it, but they may ask."
    ],
    "opening": "I need a favour. Are you available [day / time]? I need someone to have the kids for [duration]. I'd really appreciate it if you could.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The logistics",
        "example": "Here's what they'd need: [school pick-up at X, dinner, bedtime at Y]. They have [sport / medication / anything unusual]."
      },
      {
        "heading": "It's temporary",
        "example": "This isn't a regular thing. I'm getting a system in place — this one's important."
      },
      {
        "heading": "What you need from them",
        "example": "Just the basics. Feed them, get them to bed at a normal time, no big conversations about the separation."
      }
    ],
    "sideways": [
      {
        "trigger": "If they ask why you need it",
        "response": "I have something I can't reschedule. I'll explain properly when I can."
      },
      {
        "trigger": "If they say yes but add conditions",
        "response": "Keep it simple. \"That's great. I'll drop them at [time]."
      },
      {
        "trigger": "If they say no",
        "response": "No problem. I'll sort something else.\" Have a backup."
      }
    ],
    "close": "Lock in the specifics before you hang up: time, location, what to have for the kids. Don't leave it vague."
  },
  {
    "id": "telling-siblings",
    "category": "family",
    "number": 8,
    "title": "Telling siblings",
    "situation": "Telling a brother or sister. The dynamic varies but the core is the same: inform them, set the tone, and ask for what you need.",
    "before": [
      "Think about how close this sibling is to your ex. It shapes how much detail to share.",
      "Know what you actually want from them — just to know, or actively to support you?",
      "Be honest if there are things you'd rather not have shared further."
    ],
    "opening": "I've got some news. [Partner] and I have separated. It's been coming for a while. I'm okay — still working through the practical side.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The basics",
        "example": "We're sorting out where I'm living and what happens with the kids. I'll tell you more as I know more."
      },
      {
        "heading": "What you want from them",
        "example": "I'm not looking for advice. I just wanted you to hear it from me before anyone else told you."
      },
      {
        "heading": "What not to do",
        "example": "I'd rather you kept it between us for now. I'm still telling people."
      }
    ],
    "sideways": [
      {
        "trigger": "If they immediately want to process it all",
        "response": "I appreciate that. I'm not ready to get into it all yet. Let me get through the next week first."
      },
      {
        "trigger": "If they have a strong opinion about your ex",
        "response": "I hear you. Let me deal with that in my own time."
      },
      {
        "trigger": "If they get upset on your behalf",
        "response": "I know. I'm going to be okay. It's just a hard period."
      }
    ],
    "close": "I'll keep you in the loop.\" And actually do it. Siblings who feel excluded go and fill the gap themselves."
  },
  {
    "id": "telling-your-exs-family",
    "category": "family",
    "number": 9,
    "title": "Telling your ex's family",
    "situation": "You're on decent terms with your ex's family and want to acknowledge the separation directly — rather than let them hear it second-hand or through an awkward silence.",
    "before": [
      "Only do this if your ex knows and is okay with it. Don't do it before they've had a chance to tell their own family.",
      "Keep it brief. This isn't your relationship to explain.",
      "You're not looking for their sympathy or their judgement."
    ],
    "opening": "I wanted to reach out because I didn't want things to get weird without me saying anything. [Partner] and I have separated. I hope we can keep things respectful — especially for the kids.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The kids' relationship with them",
        "example": "I don't want anything to change for [kids' names] with you. You're their family."
      },
      {
        "heading": "You're not asking them to take sides",
        "example": "I'm not asking you to referee anything. I just wanted to speak plainly."
      },
      {
        "heading": "Keeping the door open",
        "example": "If you have questions or need to reach me about the kids, I'm easy to contact."
      }
    ],
    "sideways": [
      {
        "trigger": "If they take your ex's side immediately",
        "response": "That's completely fair. I just wanted to say it directly."
      },
      {
        "trigger": "If they're warm and want to stay connected",
        "response": "That means a lot. Let's make sure the kids feel that."
      },
      {
        "trigger": "If they don't respond",
        "response": "Let it go. You've done the right thing."
      }
    ],
    "close": "Keep it short. There's no perfect ending to this one — just a clean exit. \"That's all I wanted to say. Take care."
  },
  {
    "id": "handling-a-parents-grief-or-disappointment",
    "category": "family",
    "number": 10,
    "title": "Handling a parent's grief or disappointment",
    "situation": "Your parent is clearly devastated, keeps bringing up the marriage, can't let go of \"what might have been,\" or is projecting their own feelings onto the situation. You need to set a limit without a fight.",
    "before": [
      "This conversation isn't about convincing them — it's about protecting your energy.",
      "Acknowledge their feelings once. Then redirect.",
      "Know what you'll say if it escalates."
    ],
    "opening": "I know this has been hard for you too. But I need you to stop [relitigating the marriage / asking when we'll reconcile / saying what you think went wrong]. It's not helping me.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Name what you need",
        "example": "I need you to follow my lead on this. I've made the decision. I'm not going back."
      },
      {
        "heading": "Give them a role",
        "example": "What actually helps is [specific thing — visiting the kids, calling once a week, practical help]. That's where I need you."
      },
      {
        "heading": "Set the limit",
        "example": "If the conversation keeps going back to the separation, I'm going to hang up / leave. I mean that — it's not a threat, just what I need to do."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say they can't help it, they're just worried",
        "response": "I know. But worry looks different from what I need right now."
      },
      {
        "trigger": "If they cry",
        "response": "I know it's sad. I'm sad too. But I can't manage your feelings and mine at the same time."
      },
      {
        "trigger": "If they escalate",
        "response": "End the conversation. \"I have to go. I'll call you later."
      }
    ],
    "close": "Return to what you actually need from them. Leave them with something actionable so they don't feel useless — because that's usually what's driving it."
  },
  {
    "id": "the-first-logistics-conversation",
    "category": "your-ex",
    "number": 11,
    "title": "The first logistics conversation",
    "situation": "The relationship has ended and you need to have the first real conversation about what happens next — living arrangements, money, kids. This isn't a reconciliation attempt. It's a planning conversation.",
    "before": [
      "Know what your immediate priorities are: somewhere to live, access to money, a basic plan for the kids.",
      "Don't try to resolve everything at once. Aim for the next two to four weeks only.",
      "If the situation is volatile, do this in writing first, then follow up in person.",
      "Keep a record. Not as ammunition — just so you both know what was agreed."
    ],
    "opening": "We need to work out the basics. I think we can do that without making it worse. I want to talk about where each of us is staying, money in the short term, and the kids — just for the next few weeks.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Living situation",
        "example": "Who stays in the house right now, and who moves out? Even if it's temporary, we need a plan."
      },
      {
        "heading": "Money in the short term",
        "example": "We need to agree on access to accounts for essentials. Not a full settlement — just what we need to get through the next month."
      },
      {
        "heading": "The kids' schedule",
        "example": "For the kids — can we agree on where they sleep each night for the next two to four weeks? Something simple that doesn't disrupt their routine."
      }
    ],
    "sideways": [
      {
        "trigger": "If it turns into a fight about the relationship",
        "response": "I'm not going to do that right now. I want to talk about the kids and the house. Can we stay there?"
      },
      {
        "trigger": "If they refuse to engage",
        "response": "Okay. I'm going to assume [basic arrangement] unless you tell me otherwise. Let me know if that doesn't work."
      },
      {
        "trigger": "If they bring up fault or blame",
        "response": "That conversation might need to happen. Not today."
      }
    ],
    "close": "Write down what you agreed — even a text message summary. \"I'll send you a message with what we said so we're on the same page."
  },
  {
    "id": "how-to-tell-the-kids-agreeing-together",
    "category": "your-ex",
    "number": 12,
    "title": "How to tell the kids — agreeing together",
    "situation": "Before you tell the kids, you and your co-parent need to agree on what you're saying, who says it, and when. This conversation protects the kids from two conflicting stories.",
    "before": [
      "Keep the kids out of it until you've done this. Don't improvise separately.",
      "Agree on the core message: we're separating, both homes, we both love you, it's not your fault.",
      "Agree on who does the talking — one lead, the other present. Or share it.",
      "Agree on what you're not saying: no blame, no details, no promises about getting back together."
    ],
    "opening": "We need to agree on what we tell the kids, and when. I think we should do it together if we can. Can we talk through what we actually say?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The core message",
        "example": "I think we agree on the basics — that we're separating, they'll have two homes, we both love them. Does that sound right to you?"
      },
      {
        "heading": "Who leads",
        "example": "Who do you want to do the talking? I'm comfortable either way."
      },
      {
        "heading": "The timing",
        "example": "I think [day / time] works. Before that happens, we shouldn't let them hear anything from anyone else."
      }
    ],
    "sideways": [
      {
        "trigger": "If they want to do it separately",
        "response": "I'd really rather we didn't. It's confusing for them to get two different versions. Can we try to do it together?"
      },
      {
        "trigger": "If they want to blame you to the kids",
        "response": "I'm not going to agree to that. We tell them it's a joint decision — that protects them, even if it's not exactly accurate."
      },
      {
        "trigger": "If they keep delaying",
        "response": "I understand it's hard. But we need to do this by [date]. They're going to notice."
      }
    ],
    "close": "Confirm the date, time, location, and core message. That's the only thing that needs to come out of this conversation."
  },
  {
    "id": "negotiating-the-initial-parenting-schedule",
    "category": "your-ex",
    "number": 13,
    "title": "Negotiating the initial parenting schedule",
    "situation": "You need to agree on how time with the kids splits — not necessarily forever, but for now. This is the most important practical conversation in the early phase.",
    "before": [
      "Know what you actually want. Not what's \"fair\" in the abstract — what works for the kids and is realistic for you.",
      "Look at the school calendar, activity schedule, and your work schedule before this conversation.",
      "Don't go in assuming you know what they want. Ask.",
      "Week on / week off is common but not right for every family or every age. Keep an open mind."
    ],
    "opening": "I want to work out a schedule for the kids. I've got some thoughts but I want to hear yours too. The aim is something the kids can get used to quickly.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The baseline question",
        "example": "What does week on / week off look like to you? Or do you think something else works better for [kids' ages and needs]?"
      },
      {
        "heading": "Weekdays vs weekends",
        "example": "School nights are different from weekends. Do we split both evenly, or does one of us take more of one?"
      },
      {
        "heading": "Holidays and special days",
        "example": "Let's at least flag how Christmas and birthdays work, even roughly. We can nail down the details later."
      }
    ],
    "sideways": [
      {
        "trigger": "If they're being unreasonable about time",
        "response": "Let me just say what I think works for the kids, and you tell me where you disagree."
      },
      {
        "trigger": "If they threaten to go to a lawyer",
        "response": "That's your call. I'd rather we tried to work it out first — it saves everyone."
      },
      {
        "trigger": "If they shut down",
        "response": "Can we come back to this on [day]? I'll send you a rough version of what I'm thinking so you can look at it."
      }
    ],
    "close": "Agree on a trial period. \"Let's try this for a month and review it. Nothing has to be permanent right now.\" That makes it less confrontational for everyone."
  },
  {
    "id": "talking-about-money-before-lawyers-get-involved",
    "category": "your-ex",
    "number": 14,
    "title": "Talking about money before lawyers get involved",
    "situation": "You need to start discussing finances — shared assets, debts, accounts — before it goes legal. The goal is a baseline agreement that stops things getting worse, not a full settlement.",
    "before": [
      "Know what's in the joint accounts. Get screenshots.",
      "Know what you owe: mortgage, car, credit cards, shared loans.",
      "Know what you earn, and roughly what they earn.",
      "Don't enter with a number you'll accept — enter with a principle: \"the kids stay stable\" or \"we both keep what we came in with."
    ],
    "opening": "We need to talk about money at some point. I want to do it before we both spend a lot on lawyers. I'm not trying to win — I just want something fair we can both live with.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The shared accounts",
        "example": "What do we do with the joint account right now? I think we each move our income to separate accounts and use the joint one only for shared expenses — kids and mortgage."
      },
      {
        "heading": "The house",
        "example": "What's the plan with the house? Sell, one of us buys the other out, or hold it for now? I don't need an answer today, but I want to know where we both stand."
      },
      {
        "heading": "Child support",
        "example": "I think we should look at what the child support formula says and use that as a starting point. It's not perfect but it's neutral."
      }
    ],
    "sideways": [
      {
        "trigger": "If they refuse to discuss it without a lawyer",
        "response": "That's fair. I'm just flagging that I'd like to try first. Let me know if that changes."
      },
      {
        "trigger": "If they make an unreasonable claim",
        "response": "I don't think that's where we'll land. Let me come back to you with what I think is closer to fair."
      },
      {
        "trigger": "If it gets emotional",
        "response": "Let's stop. We can pick this up when it's not loaded."
      }
    ],
    "close": "Even if you don't agree on anything, agree on what you're not doing: \"Neither of us moves money without telling the other\" is a reasonable starting floor."
  },
  {
    "id": "asking-to-change-the-schedule-temporarily",
    "category": "your-ex",
    "number": 15,
    "title": "Asking to change the schedule temporarily",
    "situation": "Something has come up — work travel, illness, a commitment — and you need to change the agreed schedule for a specific period. Keep it contained and keep it temporary.",
    "before": [
      "Know the exact dates.",
      "Have a proposed swap or makeup time ready. Don't ask for a change and leave them to solve it.",
      "Don't over-explain. The more justification you give, the more negotiating surface you create."
    ],
    "opening": "I need to ask for a change to the schedule. [Date range] doesn't work for me because of [brief reason]. Can we swap it for [specific alternative]?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The request",
        "example": "I need [specific change]. In return, I can do [specific swap]."
      },
      {
        "heading": "It's temporary",
        "example": "This doesn't change anything long-term. Just this once."
      },
      {
        "heading": "Their needs",
        "example": "Does that work for you? I want to make sure the kids aren't disrupted."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say no without reason",
        "response": "Can I ask what the issue is? I'd like to find something that works."
      },
      {
        "trigger": "If they use it as leverage",
        "response": "I'm only talking about [these dates]. Can we deal with the bigger stuff separately?"
      },
      {
        "trigger": "If they agree but make it difficult",
        "response": "Accept it, say thank you, and move on."
      }
    ],
    "close": "Confirm in writing. A text is fine. \"Just to confirm — [swap arrangement]. Thanks."
  },
  {
    "id": "handling-a-schedule-dispute-without-escalating",
    "category": "your-ex",
    "number": 16,
    "title": "Handling a schedule dispute without escalating",
    "situation": "There's a disagreement about custody time — missed handovers, late returns, an ongoing pattern of small violations. You need to address it without it spiralling.",
    "before": [
      "Keep a record. Dates, times, what happened, what was agreed. Not as a weapon — to stay factual.",
      "Know what outcome you actually want before you speak. More makeup time? A simple acknowledgment?",
      "Stay off social media. Anything you post can be used."
    ],
    "opening": "I need to raise something. [Specific incident] happened and it's not the first time. I'd like to sort it out properly so we both know where we stand.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific pattern",
        "example": "On [date], [what happened]. Before that, [previous instance]. I'm not trying to escalate, but I need it to stop."
      },
      {
        "heading": "What you're asking for",
        "example": "Going forward, I need [specific behaviour — kids back by 6pm Sunday, advance notice if plans change]."
      },
      {
        "heading": "The consequence if it continues",
        "example": "If it keeps happening, I'm going to have to get advice. I don't want to do that."
      }
    ],
    "sideways": [
      {
        "trigger": "If they deny it happened",
        "response": "I have the dates. I'm not interested in arguing about whether it happened — I just want it not to happen again."
      },
      {
        "trigger": "If they counter with their own grievances",
        "response": "Let's deal with those separately. Right now I'm asking about [specific issue]."
      },
      {
        "trigger": "If they threaten legal action",
        "response": "That's your right. I'd rather we solved it now."
      }
    ],
    "close": "Get a clear answer: \"So we agree that going forward, [specific thing]?\" If you can't get agreement, document the conversation and get advice."
  },
  {
    "id": "when-one-of-you-starts-seeing-someone",
    "category": "your-ex",
    "number": 17,
    "title": "When one of you starts seeing someone",
    "situation": "You've started seeing someone, or you know your ex has. This conversation needs to happen before the kids find out another way. The goal is information and basic ground rules — not permission.",
    "before": [
      "If it's you: only bring this up if it's becoming real enough to affect the kids' lives.",
      "If it's them: you found out, or a kid mentioned it. Stay calm.",
      "You're not asking for their approval and they're not asking for yours."
    ],
    "opening": "I want to let you know I've been seeing someone. It's early. But I didn't want you to find out through the kids.",
    "openingAlt": "The kids mentioned [person's name]. I'm not trying to make this difficult — I just want to understand what's happening so we can handle it sensibly.",
    "openingAltLabel": "If you found out and want to discuss it:",
    "cover": [
      {
        "heading": "The kids",
        "example": "I'm not introducing anyone to the kids until it's a real relationship. I'm asking the same from you."
      },
      {
        "heading": "Basic respect",
        "example": "I don't need details. I don't want to know. I just want to know the kids are okay."
      },
      {
        "heading": "Handovers",
        "example": "It's fine if [new person] isn't at handovers for now. Less complicated."
      }
    ],
    "sideways": [
      {
        "trigger": "If they react badly",
        "response": "I hear that this is hard. I'm still telling you because it's the right thing to do."
      },
      {
        "trigger": "If they want details",
        "response": "I'm not going to go into that. The relevant thing is the kids."
      },
      {
        "trigger": "If they threaten to withhold the kids",
        "response": "I'd ask you not to mix those things. Let's talk to someone if we can't work it out."
      }
    ],
    "close": "Keep it short. You've done your part by telling them. \"That's all I needed to say. Let me know if you want to talk more when it's not fresh."
  },
  {
    "id": "renegotiating-an-arrangement-that-isnt-working",
    "category": "your-ex",
    "number": 18,
    "title": "Renegotiating an arrangement that isn't working",
    "situation": "The current parenting or financial arrangement was set in the early weeks and doesn't fit the reality of life now. You need to open a conversation about changing it — without it feeling like an attack on the original agreement.",
    "before": [
      "Be specific about what isn't working and why.",
      "Come with a proposed alternative, not just a complaint.",
      "Think about what's in it for them too. The conversation goes better if there's something for both sides."
    ],
    "opening": "The current arrangement isn't working well for me — and I think there might be a version that works better for both of us. Can we talk about it?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What specifically isn't working",
        "example": "The Wednesday pickup doesn't work with my job. I end up scrambling every week."
      },
      {
        "heading": "What you're proposing",
        "example": "What if we shifted it to Thursday? That works better for me and I think it actually makes [school / activities / logistics] easier your end too."
      },
      {
        "heading": "Why it could work for both",
        "example": "Point to a mutual benefit. Not just your inconvenience."
      }
    ],
    "sideways": [
      {
        "trigger": "If they think you're trying to get more time",
        "response": "I'm not asking for more time. I'm asking to move which days."
      },
      {
        "trigger": "If they say the original agreement is fine",
        "response": "It works for you, and that makes sense. It's not working for me. I'd like to find something that works for both of us."
      },
      {
        "trigger": "If they won't engage",
        "response": "Can I send you a written version? Sometimes it's easier to look at on paper."
      }
    ],
    "close": "Agree on a trial or a review. Nothing permanent yet. \"Can we try it for six weeks and check in?"
  },
  {
    "id": "setting-communication-boundaries",
    "category": "your-ex",
    "number": 19,
    "title": "Setting communication boundaries",
    "situation": "The way you and your ex communicate isn't working — too many messages, too hostile, too late at night, or topics that belong in mediation landing in your inbox. You need to set a structure.",
    "before": [
      "Be clear on what you actually want. A specific window? A specific platform? Only certain topics?",
      "Keep your tone neutral. This isn't a complaint — it's a proposal.",
      "Expect pushback. Do it anyway."
    ],
    "opening": "I'd like to change how we communicate. It's not working well for me and I think we can do it more simply. Can I tell you what I'm thinking?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Platform",
        "example": "I'd like to keep all our communication about the kids to [email / text / an app like OurFamilyWizard]. That way there's a clear record."
      },
      {
        "heading": "Topics",
        "example": "Let's keep it to: kids' schedule, health, school, and emergencies. Not the separation and not our personal lives."
      },
      {
        "heading": "Response time",
        "example": "I'll reply to non-urgent messages within 24 hours. Urgent means something is happening with the kids today."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say it feels cold or formal",
        "response": "It's not about being cold. It's about both of us having less friction."
      },
      {
        "trigger": "If they keep using other channels after you've agreed",
        "response": "I'm not going to respond to messages on [channel]. Please use [agreed channel]."
      },
      {
        "trigger": "If they refuse entirely",
        "response": "Okay. I'm going to respond only to messages about the kids, on my timeline. That's what I'm able to manage."
      }
    ],
    "close": "This doesn't need their full agreement to work — you can change how you communicate regardless. But getting their buy-in makes it cleaner. \"Are you okay with this?"
  },
  {
    "id": "schooling-decisions",
    "category": "your-ex",
    "number": 20,
    "title": "Schooling decisions",
    "situation": "A school decision needs to be made — a change of school, an issue with a teacher, a specialist referral — and you need to do it together or at least in consultation.",
    "before": [
      "Know what decision is actually on the table. Is this your call, their call, or genuinely joint?",
      "Have the school's recommendation or relevant information on hand.",
      "If there's a significant cost involved, know the numbers."
    ],
    "opening": "I've been talking to [school / teacher / specialist] about [child's name]. There's a decision to make. I want to make sure we're aligned before I go back to them.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What the issue is",
        "example": "[Child] has been [struggling / assessed / recommended for something]. The school is suggesting [option]."
      },
      {
        "heading": "What you think",
        "example": "I think we should [your recommendation] because [brief reason]."
      },
      {
        "heading": "What you need from them",
        "example": "I need your thoughts — and I need an answer by [date] so we can tell the school."
      }
    ],
    "sideways": [
      {
        "trigger": "If they disagree",
        "response": "Okay. What do you think we should do instead?\" Listen properly."
      },
      {
        "trigger": "If they want to delay",
        "response": "I understand you need time. The school needs to hear from us by [date]. Can you come back to me by [day before]?"
      },
      {
        "trigger": "If they try to exclude you from the decision",
        "response": "I'm [child]'s parent too. I'm not going to be left out of this."
      }
    ],
    "close": "Get to a clear position: \"So we're telling the school [X]?\" If you can't agree, tell the school you need a bit more time — but don't leave it open-ended."
  },
  {
    "id": "a-major-parenting-disagreement",
    "category": "your-ex",
    "number": 21,
    "title": "A major parenting disagreement",
    "situation": "You and your co-parent disagree on something that actually matters — a medical decision, discipline approach, a significant lifestyle choice. This isn't a schedule dispute. This is values.",
    "before": [
      "Know what you actually believe and why.",
      "Know what you'll accept as a compromise and what you won't.",
      "Know when to stop. If it escalates to shouting, you've lost the conversation."
    ],
    "opening": "There's something I need to talk to you about regarding [child's name]. I think we're handling [issue] differently and I'd like to work out a consistent approach.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Your position",
        "example": "I think [your view], and here's why: [brief, specific reason]."
      },
      {
        "heading": "What you understand their position to be",
        "example": "My sense is you think [their view]. Is that right?"
      },
      {
        "heading": "The impact on the kids",
        "example": "The reason it matters to me is [specific impact on the child]. What I don't want is [the kid being confused / caught in the middle]."
      }
    ],
    "sideways": [
      {
        "trigger": "If they dismiss your position",
        "response": "I hear that we disagree. I'm still asking you to consider it."
      },
      {
        "trigger": "If it gets personal",
        "response": "I'm talking about [the issue], not you as a parent. Let's stay there."
      },
      {
        "trigger": "If it becomes a stalemate",
        "response": "I think we need a third party. I'd rather do that than stay stuck."
      }
    ],
    "close": "If you can't reach agreement: \"We're not going to solve this today. But we both need to think about it, because it's affecting [child]. Let's come back to it by [date]."
  },
  {
    "id": "asking-for-flexibility-on-a-specific-date",
    "category": "your-ex",
    "number": 22,
    "title": "Asking for flexibility on a specific date",
    "situation": "You need a change to the schedule for a birthday, family event, work trip, or other one-off. Keep it simple.",
    "before": [
      "Ask early. Not the night before.",
      "Have a swap or makeup time ready to offer.",
      "Accept the answer, even if it's no."
    ],
    "opening": "Can I ask for a favour with the schedule? [Event / reason] is on [date] and it would mean a lot to me / the kids / my family to have them there. Is that something you could work with?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific request",
        "example": "I'm asking for [date or dates]. I can offer [alternative time] in return."
      },
      {
        "heading": "Why it matters",
        "example": "It's [birthday / event / reason] — it only happens once and [child] would want to be there."
      },
      {
        "heading": "Flexibility on your end",
        "example": "If that exact swap doesn't work, let me know what does."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say no without reason",
        "response": "Can I ask if there's something specific that doesn't work? I'd like to find a version that does."
      },
      {
        "trigger": "If they use it as leverage",
        "response": "I'm just asking about this date. Let's deal with the other stuff separately."
      },
      {
        "trigger": "If they agree",
        "response": "Thank you. I'll confirm the details and let you know the plan."
      }
    ],
    "close": "Confirm in writing. \"Just to confirm — I have the kids on [date], and you have them on [makeup date]. Thanks."
  },
  {
    "id": "telling-your-manager",
    "category": "work",
    "number": 23,
    "title": "Telling your manager",
    "situation": "You need to tell your manager about the separation because it's affecting your availability, focus, or output — or because you need flexibility or leave. You're not asking for sympathy. You're managing up.",
    "before": [
      "Decide what you actually need from this conversation: flexibility, leave, time, or just awareness.",
      "You don't owe your manager details. \"A family breakdown\" is enough.",
      "Have a rough sense of what you can still deliver and what might slip."
    ],
    "opening": "I wanted to give you a heads up about something personal. I'm going through a separation at home. It's been disruptive, and I want to be upfront with you rather than have it affect my work without explanation.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you need",
        "example": "In the short term, I may need some flexibility around [hours / pickup / certain days]. I'll keep you posted."
      },
      {
        "heading": "What you can still deliver",
        "example": "I'm still across [key responsibilities]. I don't expect this to derail the main work — I just want you to have context."
      },
      {
        "heading": "How you'd like to handle it",
        "example": "I'd prefer to keep this between us. I don't need the team to know."
      }
    ],
    "sideways": [
      {
        "trigger": "If they respond with discomfort or brush it off",
        "response": "I'm not asking for anything specific right now — just wanted you to have context."
      },
      {
        "trigger": "If they push for more detail",
        "response": "It's a family matter. I'd prefer not to go into the details."
      },
      {
        "trigger": "If they immediately raise performance concerns",
        "response": "I understand. I'm trying to get ahead of that by telling you now."
      }
    ],
    "close": "I'll let you know if I need anything specific. Thanks for hearing me out.\" Keep it brief. This isn't a performance review — it's a heads up."
  },
  {
    "id": "asking-for-flexible-hours",
    "category": "work",
    "number": 24,
    "title": "Asking for flexible hours",
    "situation": "Your custody arrangement means your standard work hours don't always work. You need a formal or informal accommodation.",
    "before": [
      "Know exactly what you're asking for: start later on Mondays, leave early on Wednesdays, work from home on certain days.",
      "Know how you'll make the hours up. Have that answer ready before they ask.",
      "Frame it as a practical problem with a practical solution — not an emotional request."
    ],
    "opening": "I'd like to talk about my hours. My custody schedule means [specific day / time] is difficult. I'd like to propose an arrangement that works for both of us.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific request",
        "example": "What I'm asking for: [start time / finish time / WFH day]. That covers [what specifically it solves]."
      },
      {
        "heading": "How you'll make it work",
        "example": "I'll make the hours up by [starting earlier / staying later on other days / being available by phone]. My output won't change."
      },
      {
        "heading": "How long you need it",
        "example": "I think this is a short to medium-term thing — probably six months while things settle. I'm happy to review it."
      }
    ],
    "sideways": [
      {
        "trigger": "If they need sign-off from above",
        "response": "I understand. Can you take it to [person] and let me know?"
      },
      {
        "trigger": "If they say it's difficult",
        "response": "What specifically is the concern? I'd like to try and address it."
      },
      {
        "trigger": "If they say no",
        "response": "Okay. Can we revisit in a month?"
      }
    ],
    "close": "Ask for a decision timeline. \"When can you come back to me on this?\" Don't leave it hanging."
  },
  {
    "id": "requesting-leave",
    "category": "work",
    "number": 25,
    "title": "Requesting leave",
    "situation": "You need time off — a few days or a week — to deal with moving, court, mediation, or mental health. Frame it in a way that gets approved without oversharing.",
    "before": [
      "Know how many days you need and when.",
      "Know what leave entitlements you have — personal/carer's leave, annual leave, leave without pay.",
      "Have a brief handover in mind if your absence affects others."
    ],
    "opening": "I'd like to request [number of days] leave from [date to date]. It's for a personal matter — I can give more detail if needed, but I'd prefer to keep it brief.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The dates",
        "example": "I'd need [specific dates]. I've checked and there's no major deadline or handover conflict."
      },
      {
        "heading": "Coverage",
        "example": "[Colleague] can cover [key responsibility]. I'll brief them before I go."
      },
      {
        "heading": "The leave type",
        "example": "I'd like to use [annual leave / personal leave]. Let me know what works best from a payroll side."
      }
    ],
    "sideways": [
      {
        "trigger": "If they want to know why",
        "response": "It's a family situation. I'd rather not go into it."
      },
      {
        "trigger": "If the dates are difficult",
        "response": "I understand. What dates would work better? I have some flexibility."
      },
      {
        "trigger": "If they're unsympathetic",
        "response": "I'm entitled to the leave. I'm just asking to use it."
      }
    ],
    "close": "Get it confirmed in writing — a calendar block, an email, a system entry. \"Can you confirm that in writing so I have a record?"
  },
  {
    "id": "managing-changed-availability",
    "category": "work",
    "number": 26,
    "title": "Managing changed availability",
    "situation": "Your custody schedule means you're less available on certain days, and your team needs to know without you explaining your entire personal situation.",
    "before": [
      "Be clear on what's actually changed and what hasn't.",
      "Prepare a short, factual explanation that doesn't invite follow-up questions.",
      "Keep the emphasis on what you can still deliver."
    ],
    "opening": "I want to flag a change in my availability. On [days / times], I'll be offline earlier than usual — it's a family arrangement. Everything else stays the same.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific change",
        "example": "[Day] after [time] I'm not available. If something urgent comes up, [preferred way to reach you / alternative contact]."
      },
      {
        "heading": "What it doesn't affect",
        "example": "Meetings, deadlines, and [key responsibilities] aren't affected."
      },
      {
        "heading": "How to reach you if truly urgent",
        "example": "If something critical comes up on those afternoons, message me and I'll respond as soon as I can."
      }
    ],
    "sideways": [
      {
        "trigger": "If they push back on the availability",
        "response": "I can be flexible on specific urgent matters. But as a standing arrangement, this is what I need."
      },
      {
        "trigger": "If they ask why",
        "response": "It's a family commitment. I don't want to go into the details."
      }
    ],
    "close": "Update your calendar to reflect it. Block the time so it's visible to the team."
  },
  {
    "id": "if-your-performance-has-dipped",
    "category": "work",
    "number": 27,
    "title": "If your performance has dipped",
    "situation": "Your output has dropped and your manager has noticed. You need to acknowledge it, explain it without over-explaining, and signal that you're on the way back.",
    "before": [
      "Don't wait for a formal performance review. Get ahead of it.",
      "Know specifically what has slipped and what hasn't.",
      "Have a plan. You don't need to have everything fixed — but you need to show you're on it."
    ],
    "opening": "I want to address something before you have to bring it up. My output has slipped over the past [period] and I know it. I'm dealing with something at home and it's had more of an impact than I expected.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What's slipped",
        "example": "[Specific thing] hasn't been at the standard I'd want. I know that."
      },
      {
        "heading": "Why — briefly",
        "example": "I'm going through a separation. It's been messy. I'm not using it as an excuse — just as context."
      },
      {
        "heading": "What you're doing about it",
        "example": "I've been [reorganising / getting support / sorting the housing]. It's stabilising. I expect [thing] to be back to normal by [date]."
      }
    ],
    "sideways": [
      {
        "trigger": "If they raise a formal process",
        "response": "I understand. I'd like the chance to get ahead of that. What would you need to see?"
      },
      {
        "trigger": "If they're dismissive of the personal context",
        "response": "Noted. I'm not asking for leniency — just flagging the context."
      },
      {
        "trigger": "If they're supportive but vague",
        "response": "What specifically do you need from me in the next [period]? I want to be clear on the bar."
      }
    ],
    "close": "Agree on a check-in point. \"Can we have a quick review in [two to four weeks] to see where things are?\" Takes it out of the abstract and into something manageable."
  },
  {
    "id": "navigating-a-promotion-conversation",
    "category": "work",
    "number": 28,
    "title": "Navigating a promotion conversation",
    "situation": "A promotion was on the table and now your personal situation has complicated it. Either you want to keep it alive, or you need to put it on hold and want to manage how that reads.",
    "before": [
      "Decide whether you want to go for it now or defer it. Both are valid — but be honest with yourself.",
      "Think about what's actually blocking you — capacity, focus, optics?",
      "Don't let other people decide for you through silence."
    ],
    "opening": "I know my personal situation has been disruptive. I want to make it clear that I'm still interested in the [role / promotion]. I don't want that to drop off the radar.",
    "openingAlt": "I want to be upfront with you. I want to put the [promotion conversation] on hold for now. The timing isn't right, and I'd rather defer than start badly.",
    "openingAltLabel": "Deferring:",
    "cover": [
      {
        "heading": "Your capability and commitment",
        "example": "My circumstances are temporary. My capability and commitment to this role aren't."
      },
      {
        "heading": "What you're asking for",
        "example": "I'm asking you to stay in that conversation with me. I expect to be in a better position to step up by [rough timeframe]."
      },
      {
        "heading": "What you're not asking for",
        "example": "I'm not asking for the role right now — I'm asking that the door stays open."
      }
    ],
    "sideways": [
      {
        "trigger": "If they seem to have already moved on",
        "response": "Has the decision been made already? I'd appreciate you telling me directly."
      },
      {
        "trigger": "If they're non-committal",
        "response": "Can you give me a clear sense of the timeline and what I need to demonstrate?"
      },
      {
        "trigger": "If they suggest it's already a problem",
        "response": "What would it take to reverse that perception?"
      }
    ],
    "close": "Get something in writing — even a note that the conversation happened and you've agreed to revisit by [date]."
  },
  {
    "id": "returning-after-mental-health-leave",
    "category": "work",
    "number": 29,
    "title": "Returning after mental health leave",
    "situation": "You've taken time off for mental health reasons connected to the separation. You're coming back. You need to return without the absence becoming a permanent label.",
    "before": [
      "Get medical clearance if required.",
      "Think about what reasonable adjustments you might need in the first few weeks.",
      "Decide how much you want to share. You don't owe the team a full account."
    ],
    "opening": "Good to be back.\" Then get on with it.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Your capacity",
        "example": "I'm not at 100% yet but I'm close. I'd like to take [specific work or client load] for the first couple of weeks and ramp up from there."
      },
      {
        "heading": "What you need from the team",
        "example": "I don't need anything special. Just normal. If anyone asks, I was dealing with a family matter."
      },
      {
        "heading": "What you're not doing",
        "example": "I'm not going to have a lot of conversations about what happened. I'd appreciate you helping me redirect any of those."
      }
    ],
    "sideways": [
      {
        "trigger": "If people treat you differently",
        "response": "I'm fine, genuinely. Same as before.\" Then demonstrate it."
      },
      {
        "trigger": "If they over-support to the point of reducing your responsibility",
        "response": "I want to be clear — I'm ready for my full role. I don't need a reduced load."
      },
      {
        "trigger": "If there's lingering awkwardness",
        "response": "Ignore it. It passes."
      }
    ],
    "close": "Get into the work as fast as possible. The fastest way to reset the dynamic is to deliver something solid in your first week back."
  },
  {
    "id": "first-conversation-with-a-lawyer",
    "category": "finances-legal",
    "number": 30,
    "title": "First conversation with a lawyer",
    "situation": "You've booked a consultation with a family lawyer. You want to make the most of the time (it's billable) and leave with clear information, not more confusion.",
    "before": [
      "Write down your situation before you go in: length of relationship, kids, assets, debts, your income, their income.",
      "Write down your questions. You'll forget them in the room.",
      "Know what outcome you want — not legally, but practically. That helps them advise you."
    ],
    "opening": "I've been separated for [time period]. We have [number] kids, aged [ages]. The main assets are [house / super / car / savings]. I want to understand my options and what the process looks like.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The key facts",
        "example": "Share the numbers: property value, mortgage, super balances, income, debts. Be honest. They're on your side."
      },
      {
        "heading": "Your specific questions",
        "example": "What am I actually entitled to? What happens with the kids? How long does this take? What does it cost?"
      },
      {
        "heading": "What you want to avoid",
        "example": "I'd like to avoid court if possible. What does an out-of-court settlement look like?"
      }
    ],
    "sideways": [
      {
        "trigger": "If they talk in jargon you don't understand",
        "response": "Can you explain that in plain language?"
      },
      {
        "trigger": "If they give you worst-case scenarios",
        "response": "What's the most likely outcome, not the worst case?"
      },
      {
        "trigger": "If the cost surprises you",
        "response": "Ask for an estimate upfront. \"What am I looking at if this stays out of court? What if it doesn't?"
      }
    ],
    "close": "Leave with: the next step, a rough timeline, and a list of what you need to gather. \"What do you need from me before our next conversation?"
  },
  {
    "id": "telling-your-accountant-or-financial-advisor",
    "category": "finances-legal",
    "number": 31,
    "title": "Telling your accountant or financial advisor",
    "situation": "Your accountant or financial advisor needs to know about the separation to give you relevant advice on tax, super, and investments. Keep it factual.",
    "before": [
      "Know your joint financial position — accounts, assets, super.",
      "Know what you expect the split to look like, even roughly.",
      "Ask specifically about tax implications for the current financial year."
    ],
    "opening": "I wanted to let you know I'm going through a separation. I need your help making sure the financial side is handled properly. Where do we start?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Joint accounts and tax",
        "example": "We have a joint account and shared investments. What do I need to do before end of financial year?"
      },
      {
        "heading": "Super",
        "example": "How does superannuation get treated in a separation? What are my options?"
      },
      {
        "heading": "Your new financial position",
        "example": "Once the settlement is done, I'll be a single income household. I want to start thinking about what that looks like."
      }
    ],
    "sideways": [
      {
        "trigger": "If they seem unfamiliar with family law finance",
        "response": "Do you have experience with financial settlements? If not, can you refer me to someone who does?"
      },
      {
        "trigger": "If they give advice that seems skewed toward protecting assets",
        "response": "I want a clean settlement more than I want to win. What's the most straightforward path?"
      }
    ],
    "close": "Get a list of what they need from you and a date for the next conversation."
  },
  {
    "id": "talking-to-your-bank-about-joint-accounts",
    "category": "finances-legal",
    "number": 32,
    "title": "Talking to your bank about joint accounts",
    "situation": "You need to change how your joint accounts work — separate your income, change signatories, or set up a new account. The bank needs to understand your situation to help you.",
    "before": [
      "Know which accounts are joint and which are individual.",
      "In most cases, both account holders need to agree to close a joint account. Know this going in.",
      "If there's a risk your ex could drain funds, act quickly and speak to the bank in person."
    ],
    "opening": "I'm going through a separation and I need to review my accounts. I'd like to [separate my income into a sole account / change the signatories on the joint account / understand my options].",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Immediate action",
        "example": "Can I move my income to a separate account today? What do I need to do that?"
      },
      {
        "heading": "The joint account",
        "example": "What happens to the joint account? Can one of us withdraw or close it without the other?"
      },
      {
        "heading": "Protection",
        "example": "Is there anything I can do to protect my access to funds while the settlement is being worked out?"
      }
    ],
    "sideways": [
      {
        "trigger": "If they say you need your ex present to make changes",
        "response": "What changes can I make today without their presence?"
      },
      {
        "trigger": "If they're unhelpful",
        "response": "Ask to speak to a senior advisor or visit another branch."
      }
    ],
    "close": "Leave with a clear record of what was changed and what still requires both parties. Get it in writing if possible."
  },
  {
    "id": "talking-to-a-mortgage-broker",
    "category": "finances-legal",
    "number": 33,
    "title": "Talking to a mortgage broker",
    "situation": "You need to understand if you can refinance the mortgage into your name alone, get a new mortgage as a single applicant, or what your options are if neither is possible.",
    "before": [
      "Know your income and approximate expenses.",
      "Know the current mortgage balance and property value.",
      "Know your credit history — if there are issues, acknowledge them early."
    ],
    "opening": "I'm going through a separation and I need to understand my mortgage options. Either I'll need to refinance to take over the existing mortgage, or I'll be looking for a new loan as a single applicant. Can you help me work out what's realistic?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Your borrowing capacity",
        "example": "What can I actually borrow on my income? I want a realistic number, not an optimistic one."
      },
      {
        "heading": "The existing property",
        "example": "If I want to keep the house, what would refinancing look like?"
      },
      {
        "heading": "Alternatives",
        "example": "If I can't refinance, what are my options? What does a new purchase look like on my own?"
      }
    ],
    "sideways": [
      {
        "trigger": "If your borrowing capacity is less than you hoped",
        "response": "What would it take to get there? What needs to change?"
      },
      {
        "trigger": "If they're overly optimistic to win your business",
        "response": "Give me the conservative number, not the best case."
      }
    ],
    "close": "Get a conditional pre-approval assessment if you can. Knowing your actual number is the foundation for all other decisions."
  },
  {
    "id": "splitting-shared-debt-with-your-ex",
    "category": "finances-legal",
    "number": 34,
    "title": "Splitting shared debt with your ex",
    "situation": "You have shared debt — credit cards, personal loans, car loans — and need to agree on who takes what.",
    "before": [
      "List every shared debt. Amount, interest rate, who's currently making payments.",
      "Know who benefited most from each debt. It helps frame the conversation.",
      "Understand that lenders don't recognise private separation agreements — they'll still pursue both names if payments stop."
    ],
    "opening": "We need to work out what happens with our shared debts. I've made a list. I'd like us to go through it and agree on who takes responsibility for what — and then make sure the lenders reflect that.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What's on the table",
        "example": "[Debt 1], [debt 2], [debt 3]. Here's what's owed on each."
      },
      {
        "heading": "A proposed split",
        "example": "I'm thinking I take [debts A and B] and you take [debt C]. That roughly balances out."
      },
      {
        "heading": "Getting lenders updated",
        "example": "We need to actually get each debt into one name. A verbal agreement between us doesn't protect either of us legally."
      }
    ],
    "sideways": [
      {
        "trigger": "If they dispute the amounts",
        "response": "Let's pull the statements. Numbers first, argument second."
      },
      {
        "trigger": "If they won't take responsibility for a debt",
        "response": "Then I'm going to raise it with the lawyer as something that needs to be resolved formally."
      },
      {
        "trigger": "If they stop paying their portion",
        "response": "Document it. Inform the lender. Get advice."
      }
    ],
    "close": "Write it down. A shared document or email summary is enough for now — but the real close is when the debts are formally in individual names."
  },
  {
    "id": "negotiating-asset-splits-before-it-goes-formal",
    "category": "finances-legal",
    "number": 35,
    "title": "Negotiating asset splits before it goes formal",
    "situation": "You want to discuss how assets divide before lawyers take over and costs mount. This is early-stage and exploratory — not binding.",
    "before": [
      "Know what all the assets are: property, super, shares, savings, car, business interests.",
      "Know roughly what each is worth.",
      "In Australian family law, both financial contributions and non-financial contributions (like primary caring) are considered. Know your position."
    ],
    "opening": "I'd like to talk about how we split things. I want to try and do it ourselves before it costs us both a lot of money in legal fees. I'm not trying to get more than I should — I just want a fair outcome.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The asset list",
        "example": "Here's what I think we have: [property equity, super, savings, car, other]. Does that look right to you?"
      },
      {
        "heading": "Your principle",
        "example": "I'm thinking we [roughly equal split / reflect who brought what in / account for primary carer status]. What do you think is fair?"
      },
      {
        "heading": "What still needs formal advice",
        "example": "We'll need a financial agreement drawn up properly, even if we agree informally first. I think that's worth doing."
      }
    ],
    "sideways": [
      {
        "trigger": "If they have very different expectations",
        "response": "Let's write down both positions and get a mediator to help us find the middle."
      },
      {
        "trigger": "If they refuse to engage at all",
        "response": "I'd rather do this without lawyers. But if that's not possible, I'll have to get advice."
      },
      {
        "trigger": "If they make an obviously unfair claim",
        "response": "I don't think that reflects what we both put in. I'm not going to agree to that."
      }
    ],
    "close": "Don't agree to anything final in this conversation. Agree on a next step: mediator, financial adviser, or coming back with legal input."
  },
  {
    "id": "talking-to-a-debt-collector",
    "category": "finances-legal",
    "number": 36,
    "title": "Talking to a debt collector",
    "situation": "A bill in your name or a joint name hasn't been paid during the chaos of separation and a debt collector has contacted you. You need to deal with it without making it worse.",
    "before": [
      "Know what the debt actually is. Get the original creditor, the amount, and the date it arose.",
      "Know your rights — a debt collector cannot harass you, contact you at unreasonable times, or mislead you.",
      "Don't make a payment or acknowledgment without understanding the full picture."
    ],
    "opening": "I received your contact about [reference number / debt]. I want to deal with this properly. Can you confirm the original creditor, the full amount outstanding, and your authority to collect?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Verification",
        "example": "I need that in writing before I proceed. Can you send me a formal notice of the debt?"
      },
      {
        "heading": "Your situation briefly",
        "example": "I've recently separated and there was a period where some bills weren't managed. I'm trying to deal with everything systematically."
      },
      {
        "heading": "A payment arrangement if needed",
        "example": "If the debt is legitimate, I'm willing to set up a payment arrangement. What's the minimum regular payment you'll accept?"
      }
    ],
    "sideways": [
      {
        "trigger": "If they pressure you to pay immediately",
        "response": "I won't make a payment today. I'll respond to the written notice within [timeframe]."
      },
      {
        "trigger": "If they're aggressive",
        "response": "I'm going to end this call and deal with it in writing. Please send the formal notice to [address / email]."
      },
      {
        "trigger": "If the debt is disputed",
        "response": "I'm not acknowledging this debt. I'll be seeking advice before responding."
      }
    ],
    "close": "Get everything in writing. Don't agree to anything verbally that you haven't fully understood."
  },
  {
    "id": "telling-close-friends",
    "category": "social-friends",
    "number": 37,
    "title": "Telling close friends",
    "situation": "Telling friends who are close enough to be affected by the news. The goal is to inform them, set the tone, and signal what you need from them.",
    "before": [
      "Tell them before they hear it elsewhere.",
      "Know what you want from them: presence, practical help, space, or just acknowledgment.",
      "You don't have to tell the whole story in one go."
    ],
    "opening": "I've got some news. [Partner] and I have separated. It's been in the works for a while. I'm okay — still in the middle of sorting everything out, but I wanted you to hear it from me.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The basics",
        "example": "I'm [still at the house / have moved / figuring out where I'm landing]. The kids are okay."
      },
      {
        "heading": "What you actually want",
        "example": "I'm not looking for advice. I just wanted you to know. [If you need something specific: the thing I'd actually find helpful is…]"
      },
      {
        "heading": "What you don't need",
        "example": "I don't want it to be a big thing. I just want things to be as normal as possible between us."
      }
    ],
    "sideways": [
      {
        "trigger": "If they take it harder than you",
        "response": "I know it's a lot. I'm actually okay right now. Let me be the one who's okay."
      },
      {
        "trigger": "If they immediately offer opinions about your ex",
        "response": "I appreciate you caring. I'm not in the space to get into that right now."
      },
      {
        "trigger": "If they get awkward",
        "response": "It's alright. It's big news. You don't have to know what to say."
      }
    ],
    "close": "I'll keep you in the loop. Let's keep plans.\" Normalising your friendship is the most useful thing a close friend can do."
  },
  {
    "id": "the-whose-side-are-you-on-conversation",
    "category": "social-friends",
    "number": 38,
    "title": "The \"whose side are you on\" conversation",
    "situation": "A mutual friend has pulled back, been weird, or made it clear they've been talking to your ex more than you. You need to have a direct conversation without issuing an ultimatum.",
    "before": [
      "Don't do this by text.",
      "Know what you actually want: to understand where they stand, or to ask them not to pass on your business.",
      "Be prepared that they may not choose your side. That's a real possibility."
    ],
    "opening": "I want to be direct with you. Things have been a bit different between us since [the separation]. I'm not trying to make it awkward — I just want to understand where we're at.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you've noticed",
        "example": "You've seemed more distant. I don't know if that's deliberate or just how things have worked out."
      },
      {
        "heading": "What you're not asking for",
        "example": "I'm not asking you to cut off [ex's name]. You can have whatever friendship you want with them."
      },
      {
        "heading": "What you are asking for",
        "example": "What I'd ask is that things we talk about don't get back to [ex]. That's the part I care about."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say you're being paranoid",
        "response": "Maybe. I'd rather ask directly than let it fester."
      },
      {
        "trigger": "If they say they're still friends with your ex and can't change that",
        "response": "I'm not asking you to. I'm asking for discretion."
      },
      {
        "trigger": "If they side with your ex openly",
        "response": "I appreciate you being honest. I'd rather know."
      }
    ],
    "close": "Whatever they say, leave cleanly. \"Thanks for talking about it. I'd rather know where we stand.\" Don't let it become a scene."
  },
  {
    "id": "when-mutual-friends-go-quiet",
    "category": "social-friends",
    "number": 39,
    "title": "When mutual friends go quiet",
    "situation": "Friends you shared as a couple have drifted or gone silent. You're not sure if they're waiting to see how things settle, have sided with your ex, or are just uncomfortable. You want to re-establish contact.",
    "before": [
      "Deal with people individually. Not a group message.",
      "Lower your expectations. Some of these friendships won't survive the separation. That's normal, not a failure.",
      "Be the one who reaches out — not demanding, just present."
    ],
    "opening": "Hey. I know it's been a bit quiet since everything happened. I wanted to check in. How are you doing?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Signal that things are still normal",
        "example": "I'm getting back on my feet. I'd like to catch up properly when you're free."
      },
      {
        "heading": "Give them an easy out",
        "example": "If things are complicated for you right now, I get it. Just wanted you to know the door's open."
      }
    ],
    "sideways": [
      {
        "trigger": "If they stay awkward",
        "response": "Give it time. One more reach-out in a month. Then let it go."
      },
      {
        "trigger": "If they reveal they've been closer to your ex",
        "response": "I figured. I'm not trying to cause problems. I just didn't want to disappear without saying something."
      },
      {
        "trigger": "If they respond warmly",
        "response": "Make a plan. Lock in a date. Don't leave it as an intention."
      }
    ],
    "close": "Something concrete or nothing at all. \"Let's have a coffee on [day].\" Or leave it open and try again later. The goal is just to stay connected."
  },
  {
    "id": "friends-who-knew-you-as-a-couple",
    "category": "social-friends",
    "number": 40,
    "title": "Friends who knew you as a couple",
    "situation": "Friends who were primarily couple-friends — people you socialised with as a pair. Some of them won't know how to relate to you individually. You want to keep the ones worth keeping.",
    "before": [
      "Accept that some of these friendships will naturally end. The shared social unit was part of the draw.",
      "The ones worth keeping need to see you in a new context.",
      "Don't mourn the group before you know what's actually left."
    ],
    "opening": "I know we've mainly spent time as couples. I'm happy to still do that stuff, but I wanted to make sure things between us aren't weird. Are we okay?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Acknowledging the awkward",
        "example": "I get that it changes the dynamic. I'm not expecting things to be exactly the same."
      },
      {
        "heading": "What you want",
        "example": "I like you. I don't want to lose this friendship because of what's happened."
      },
      {
        "heading": "Being specific",
        "example": "I'd like to keep catching up — even if it looks different now."
      }
    ],
    "sideways": [
      {
        "trigger": "If they're politely distant",
        "response": "Let it go. Don't force it."
      },
      {
        "trigger": "If they're actively warm",
        "response": "Follow through. Book something."
      },
      {
        "trigger": "If they ask lots of questions about the separation",
        "response": "I'm not ready to go into all of it. But I'm doing fine."
      }
    ],
    "close": "Make a concrete plan if the warmth is there. Let it rest if it isn't."
  },
  {
    "id": "explaining-your-new-living-situation",
    "category": "social-friends",
    "number": 41,
    "title": "Explaining your new living situation",
    "situation": "People will ask where you're living. You need a short, neutral answer that doesn't invite follow-up or sympathy.",
    "before": [
      "Have the answer ready. Fumbling it makes it feel bigger than it is.",
      "Keep it matter-of-fact."
    ],
    "opening": "I've moved to [suburb / a rental / a place nearby]. Still getting settled.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What's the same",
        "example": "The kids are between both places. It's working fine.\" Then redirect. \"Anyway — how are you?"
      }
    ],
    "sideways": [
      {
        "trigger": "If they push for more detail",
        "response": "It's still early days. I'll have more of a picture soon."
      },
      {
        "trigger": "If they express pity",
        "response": "I'm genuinely fine. It's actually pretty manageable."
      }
    ],
    "close": "Change the subject. This doesn't need more than two or three sentences."
  },
  {
    "id": "asking-a-friend-for-practical-help",
    "category": "social-friends",
    "number": 42,
    "title": "Asking a friend for practical help",
    "situation": "You need actual, specific help — someone to help you move, take the kids for an afternoon, a spare room for a week, a loan. This conversation is harder than it sounds.",
    "before": [
      "Be specific. \"Any chance you could help me move on Saturday?\" is askable. \"I just need support\" isn't.",
      "Know what you'll do if they say no.",
      "Give them a genuine out."
    ],
    "opening": "Can I ask a favour? I need [specific thing] and I immediately thought of you. You're one of the few people I'd ask.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific request",
        "example": "I need [X] on [day]. It would take about [how long]. It would genuinely help me."
      },
      {
        "heading": "Why you're asking them",
        "example": "I'm asking you because [you have a ute / you're nearby / I trust you / you've been through this]."
      },
      {
        "heading": "The easy out",
        "example": "If it's not possible, don't worry — I'm not going to be weird about it."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say no",
        "response": "Honestly, no problem. I appreciate you considering it.\" Move on."
      },
      {
        "trigger": "If they say yes",
        "response": "Confirm the logistics clearly. Don't be late. Say thank you afterwards — specifically."
      }
    ],
    "close": "Keep it clean. \"That means a lot. I'll send you the details.\" Or \"No problem at all — I'll figure something out."
  },
  {
    "id": "when-a-friendship-changes-after-separation",
    "category": "social-friends",
    "number": 43,
    "title": "When a friendship changes after separation",
    "situation": "A friendship has shifted and you need to either acknowledge it or have an honest conversation about what's happened.",
    "before": [
      "Be honest with yourself about whether this friendship is changing because of them or because of you.",
      "Know what outcome you want: clarity, repair, or just acceptance."
    ],
    "opening": "I've noticed things have been a bit different between us lately. I don't want to make it weird but I'd rather say something than let it drift.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you've noticed",
        "example": "We've been less in touch since [the separation / the move]. I'm not sure if that's just timing or something else."
      },
      {
        "heading": "What you want",
        "example": "I value this friendship. I'd rather know if something has changed than keep wondering."
      },
      {
        "heading": "What you're offering",
        "example": "I'm not looking for a big conversation. I just want to know if we're okay."
      }
    ],
    "sideways": [
      {
        "trigger": "If they acknowledge the distance but can't explain it",
        "response": "That's okay. I just needed to say something."
      },
      {
        "trigger": "If they raise an issue with you",
        "response": "Listen first. Respond without defensiveness."
      },
      {
        "trigger": "If they say everything is fine when it clearly isn't",
        "response": "You've opened the door. Let it rest."
      }
    ],
    "close": "Make a plan if the conversation goes well. If it doesn't, you've got your answer."
  },
  {
    "id": "talking-to-someone-whos-been-through-it",
    "category": "social-friends",
    "number": 44,
    "title": "Talking to someone who's been through it",
    "situation": "You know someone who's been through separation and you want to talk to them properly — not for advice exactly, but for perspective and company.",
    "before": [
      "Ask first. \"Are you okay to talk about your experience? I'm going through something similar.",
      "Be clear you're not necessarily looking for advice unless you ask for it.",
      "Know what you want: to feel less alone, to understand the timeline, to hear what helped."
    ],
    "opening": "I know you went through a separation a while back. I'm in the middle of one now and I wondered if you'd be willing to talk about it. I'm not looking for advice — I just think it would help to hear from someone who's come out the other side.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you're dealing with",
        "example": "Give them a short version: where you are in the process, what's hardest."
      },
      {
        "heading": "What you want from the conversation",
        "example": "I'm mainly trying to understand if what I'm feeling is normal. And what helped you."
      }
    ],
    "sideways": [
      {
        "trigger": "If they go straight into advice mode",
        "response": "I appreciate that. I think what I need more than advice is just to hear the story."
      },
      {
        "trigger": "If it clearly triggers them",
        "response": "I'm sorry — I didn't mean to drag it up. We don't have to."
      },
      {
        "trigger": "If they're really helpful",
        "response": "Tell them specifically. \"The thing about [X] really landed. I appreciate you sharing that."
      }
    ],
    "close": "Thank them specifically. Don't leave it generic."
  },
  {
    "id": "talking-to-your-childs-teacher",
    "category": "kids-world",
    "number": 45,
    "title": "Talking to your child's teacher",
    "situation": "The school needs to know what's going on at home so they can watch for changes in your child and handle communications sensibly.",
    "before": [
      "Request a brief private meeting — not drop-off or pick-up.",
      "Agree with your co-parent on what the school is told, and by whom.",
      "Think about what specific support you're asking for."
    ],
    "opening": "I wanted to let you know that [child's name]'s parents have separated recently. I don't need to go into detail, but I wanted you to be aware — it may affect [child] at school.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What they might notice",
        "example": "[Child] may be [more distracted / quieter / more emotional] than usual. I wanted you to have context."
      },
      {
        "heading": "How communications should work",
        "example": "For now, [parent] is the main contact for school communications. If that changes, I'll let you know."
      },
      {
        "heading": "What you're asking for",
        "example": "I'd just appreciate you keeping an eye on [child] and letting me know if anything concerns you."
      }
    ],
    "sideways": [
      {
        "trigger": "If they want more detail about the separation",
        "response": "I'd rather keep the personal details separate. The relevant thing is how [child] is at school."
      },
      {
        "trigger": "If they raise an existing concern about the child",
        "response": "Listen carefully. It may be related or pre-existing."
      }
    ],
    "close": "Thank you for making this easy. Please reach out if you notice anything."
  },
  {
    "id": "updating-the-schools-emergency-contacts-and-custody-details",
    "category": "kids-world",
    "number": 46,
    "title": "Updating the school's emergency contacts and custody details",
    "situation": "The school has outdated contact and custody information. You need to update it without turning it into a dispute.",
    "before": [
      "Know what changes need to be made: emergency contacts, pickup authorisation, medical contacts.",
      "Have the new address and contact details ready.",
      "If there's a parenting order, bring a copy for the school's records."
    ],
    "opening": "I need to update some of [child]'s records. We've separated and the family details have changed. Can I speak to someone in admin?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Updated contacts",
        "example": "The primary contact for [child] is now [details]. Emergencies should go to [person] first."
      },
      {
        "heading": "Custody and pickup",
        "example": "[Child] can be picked up by [both parents / parent A on these days / specified adults]. Here's the arrangement."
      },
      {
        "heading": "Parenting order if applicable",
        "example": "We have a parenting order. Here's a copy for your records."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say both parents need to agree",
        "response": "The order gives me authority to make these changes. Here it is."
      },
      {
        "trigger": "If there are discrepancies between what the two parents have told the school",
        "response": "I'd ask you to go with the official order."
      }
    ],
    "close": "Ask for confirmation that the records have been updated. Ask them to email a summary."
  },
  {
    "id": "talking-to-a-sports-coach-or-club-about-custody-logistics",
    "category": "kids-world",
    "number": 47,
    "title": "Talking to a sports coach or club about custody logistics",
    "situation": "Your child's sports schedule straddles both households. The coach or club needs to understand the arrangement so your child doesn't miss training because of poor communication.",
    "before": [
      "Be clear on who is responsible for getting the child to training on which days.",
      "Know the schedule for the season.",
      "Let the coach know who to contact and when."
    ],
    "opening": "I just want to give you a heads up that [child]'s family situation has changed — their parents are separated. I want to make sure it doesn't affect [child]'s attendance or experience.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The practical arrangement",
        "example": "[Child] is with me on [days] and their other parent on [days]. For training on [day], [who drops / picks up]."
      },
      {
        "heading": "Who to contact",
        "example": "The best contact for [specific days] is [parent A] and for [other days] is [parent B]."
      },
      {
        "heading": "What you want from the club",
        "example": "If [child] isn't turning up or seems off, please let me know directly."
      }
    ],
    "sideways": [
      {
        "trigger": "If they're unsure who to call when",
        "response": "Simplify it. \"When in doubt, message me."
      },
      {
        "trigger": "If the co-parent has said something different",
        "response": "Can we get on a call together to clarify? I want to make it simple for you."
      }
    ],
    "close": "Give them both contacts in writing. \"I'll send you a message with the details so you've got it."
  },
  {
    "id": "a-school-event-where-both-parents-will-be-present",
    "category": "kids-world",
    "number": 48,
    "title": "A school event where both parents will be present",
    "situation": "A concert, sports day, or parent-teacher night — both of you are going. You need to manage the logistics so the child's experience isn't overshadowed by adult tension.",
    "before": [
      "Agree with your co-parent in advance: together or separately?",
      "Keep it brief. You don't need a script for the whole event.",
      "This is about the child's experience. That's the frame."
    ],
    "opening": "[Event] is on [date]. I'm planning to be there. Are you going? I just want to work out whether we're sitting together or separately so there's no awkwardness on the day.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The plan",
        "example": "I think it's easier if we [sit together / sit separately but both be there]. The main thing is [child] sees both of us without it being weird."
      },
      {
        "heading": "What you'll do if it's tense",
        "example": "If we need to talk, let's do it before or after — not during."
      },
      {
        "heading": "How you'll handle other parents asking",
        "example": "We're there for [child's name]. That's it."
      }
    ],
    "sideways": [
      {
        "trigger": "If they don't want to coordinate",
        "response": "That's fine. I'll be there at [time]. We don't need to discuss it further."
      },
      {
        "trigger": "If it's tense on the day",
        "response": "Focus entirely on your child. That's the job."
      }
    ],
    "close": "Confirm the plan before the day. \"I'll see you there\" is enough."
  },
  {
    "id": "asking-the-school-to-keep-communications-separate",
    "category": "kids-world",
    "number": 49,
    "title": "Asking the school to keep communications separate",
    "situation": "You want school communications to go separately to both parents, or you want to be added to communications that currently only go to your ex.",
    "before": [
      "Know what communications you're not receiving.",
      "This is a standard request — schools deal with it regularly.",
      "If there's a parenting order that mentions joint decision-making, reference it."
    ],
    "opening": "I'd like to make sure both parents receive school communications separately. Can you update your records so that [newsletters / reports / teacher emails] go to both [my email] and [ex's email]?",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What specifically you want",
        "example": "I'd like to be included on all communications about [child's name]. Not just the ones that are forwarded on."
      },
      {
        "heading": "Why",
        "example": "We're both making decisions for [child's name]. I need to be in the loop."
      },
      {
        "heading": "Going forward",
        "example": "If anything changes, I'll let you know. But as a default, both parents should receive everything."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say one parent is listed as the primary contact",
        "response": "I'd like that to change. We have shared parenting responsibilities."
      },
      {
        "trigger": "If they're resistant",
        "response": "Is there a form I need to fill in? I want to make it as easy as possible for you."
      }
    ],
    "close": "Get confirmation in writing. \"Can you let me know once that's been updated?"
  },
  {
    "id": "telling-your-kids-youre-seeing-someone",
    "category": "new-relationships",
    "number": 50,
    "title": "Telling your kids you're seeing someone",
    "situation": "You've been seeing someone for a while and it's become real enough that the kids should know — before they find out another way.",
    "before": [
      "Only have this conversation when it's a real relationship. Not the first month.",
      "Do it before any introduction. They should know there's someone before they meet them.",
      "Keep it low-key. This doesn't need to be a big announcement."
    ],
    "opening": "I want to tell you something. I've been spending time with someone. Their name is [name]. We're friends and I like spending time with them.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Keep it simple",
        "example": "That's it for now. I'm not asking you to feel anything about it. I just wanted to tell you."
      },
      {
        "heading": "It doesn't change anything",
        "example": "Everything between you and me is exactly the same. You're my kids. Nothing changes that."
      },
      {
        "heading": "Space to react",
        "example": "If you have questions, you can ask. And if you don't want to talk about it, that's fine too."
      }
    ],
    "sideways": [
      {
        "trigger": "If they get upset or angry",
        "response": "I get it. It's weird to hear. You don't have to be okay with it right away."
      },
      {
        "trigger": "If they ask if you're going to get married",
        "response": "I'm not thinking about that. I'm just telling you about someone I like."
      },
      {
        "trigger": "If they say they don't want to meet them",
        "response": "That's fine. You don't have to meet anyone until you're ready."
      }
    ],
    "close": "Don't make it a bigger deal than it is. Return to normal. The kids will process at their own pace."
  },
  {
    "id": "introducing-a-new-partner-to-your-kids",
    "category": "new-relationships",
    "number": 51,
    "title": "Introducing a new partner to your kids",
    "situation": "The time has come for your kids to meet your partner. This should be low-stakes, short, and casual — not a formal introduction.",
    "before": [
      "Make sure your kids already know someone exists. (See script 50.)",
      "Make the first meeting casual — a meal, an outing, something with structure.",
      "Brief your partner: follow the kids' lead, no big displays of affection, no \"trying too hard.",
      "Have an exit plan if it goes badly."
    ],
    "opening": "[Name] is coming with us to [activity] on [day]. We're just doing [normal thing]. Should be good.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The framing",
        "example": "[Name] is someone I've been spending time with. You've heard me mention them."
      },
      {
        "heading": "What you're not asking for",
        "example": "I'm not asking you to like them or be their best friend. I'm just asking you to be normal."
      },
      {
        "heading": "Afterwards — asked casually, not with high stakes",
        "example": "What did you think?"
      }
    ],
    "sideways": [
      {
        "trigger": "If the kids are cold or dismissive",
        "response": "Don't overcompensate or push. Address it privately later."
      },
      {
        "trigger": "If the kids react strongly",
        "response": "I hear you. Tell me what you're feeling.\" Don't defend your partner in that moment."
      },
      {
        "trigger": "If it goes better than expected",
        "response": "Good. Don't over-celebrate. Let it build at its own pace."
      }
    ],
    "close": "Keep the first meeting short. Leave on a positive note. Let the relationship develop from there."
  },
  {
    "id": "your-exs-reaction-to-your-new-partner",
    "category": "new-relationships",
    "number": 52,
    "title": "Your ex's reaction to your new partner",
    "situation": "Your ex has found out you're seeing someone — through the kids, a mutual friend, or you told them. They're reacting. You need to manage it.",
    "before": [
      "You don't owe them a detailed explanation.",
      "If it affects the kids' routine, that's the only part that's genuinely their business.",
      "Stay calm. Their emotional reaction is not yours to fix."
    ],
    "opening": "I know you've heard I'm seeing someone. I wasn't trying to hide it.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What's relevant to them",
        "example": "The kids are fine. This doesn't affect the parenting arrangement."
      },
      {
        "heading": "What's not their business",
        "example": "The details of my personal life aren't something I'm going to discuss."
      },
      {
        "heading": "What you expect from them",
        "example": "I'd ask that this doesn't become a conversation the kids are part of."
      }
    ],
    "sideways": [
      {
        "trigger": "If they make threats about custody",
        "response": "I'd ask you not to involve the kids in this. If you want to raise custody formally, do it properly."
      },
      {
        "trigger": "If they get very emotional",
        "response": "I'm sorry this is hard. But I'm not in a position to change it."
      },
      {
        "trigger": "If they're surprisingly okay with it",
        "response": "Move on. Don't over-process it."
      }
    ],
    "close": "Keep it short. The less said here, the better."
  },
  {
    "id": "when-your-kids-ask-hard-questions-about-the-new-person",
    "category": "new-relationships",
    "number": 53,
    "title": "When your kids ask hard questions about the new person",
    "situation": "Your kids are asking questions about your relationship. Here are answers to the predictable ones — honest and age-appropriate.",
    "before": [
      "Have simple, honest answers ready.",
      "Don't speculate about the future. Kids need the truth, not reassurance built on uncertainty."
    ],
    "opening": "",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [],
    "sideways": [],
    "close": "Don't force resolution. \"It's okay to have questions. You can always ask me.\" Then move on."
  },
  {
    "id": "talking-to-a-new-partner-about-your-custody-schedule",
    "category": "new-relationships",
    "number": 54,
    "title": "Talking to a new partner about your custody schedule",
    "situation": "You're seeing someone seriously and they need to understand what your life with kids actually looks like — so they're not surprised, and so you're both starting from a realistic place.",
    "before": [
      "Do this before you're too invested. It's easier to have it early.",
      "Be concrete, not approximate.",
      "Be honest about what you can and can't offer in terms of time."
    ],
    "opening": "I want to be clear about what my life looks like — so we're both starting from a realistic place.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The schedule",
        "example": "I have the kids [weeks on / specific days]. On those days, I'm not available for evening plans or overnights."
      },
      {
        "heading": "What's non-negotiable",
        "example": "The kids come first when I'm with them. That's not going to change."
      },
      {
        "heading": "What is flexible",
        "example": "On my weeks off, I'm genuinely free. That's where our time mostly lives."
      },
      {
        "heading": "The longer term",
        "example": "This is the reality for probably the next [decade]. It changes as they get older, but it doesn't go away."
      }
    ],
    "sideways": [
      {
        "trigger": "If they push back on the constraints",
        "response": "I'd rather be honest now than have it become resentment later."
      },
      {
        "trigger": "If they seem overwhelmed",
        "response": "It's fine if this isn't what you were looking for. I'd rather know early."
      }
    ],
    "close": "This isn't a test or an ultimatum. It's information. \"I just want us to start with the real picture."
  },
  {
    "id": "talking-to-your-gp",
    "category": "wellbeing",
    "number": 55,
    "title": "Talking to your GP",
    "situation": "You need to tell your GP what's been happening so they have context for any health issues — sleep problems, anxiety, stress symptoms — that have surfaced during the separation.",
    "before": [
      "Book a longer appointment if the conversation needs more than the standard slot.",
      "Write down your main symptoms beforehand — you'll forget under pressure.",
      "Be honest. GPs have heard everything."
    ],
    "opening": "I've been going through a separation over the past [period] and I think it's affecting my health. I want to be upfront about that.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Physical symptoms",
        "example": "I've been [not sleeping / not eating / having chest tightness / headaches]. Here's when it started and how frequent it is."
      },
      {
        "heading": "Mental state",
        "example": "I'm managing, but there are days when I'm not. I want to be honest rather than say I'm fine."
      },
      {
        "heading": "What you want",
        "example": "I'm not looking for medication necessarily — I want to understand what's going on and whether I should do anything."
      }
    ],
    "sideways": [
      {
        "trigger": "If they move too quickly to medication",
        "response": "I'd like to understand what I'm dealing with before we go there. What do you think is causing this?"
      },
      {
        "trigger": "If they dismiss the mental side",
        "response": "I want to flag that I think stress is behind a lot of it. Is that something we can talk about?"
      }
    ],
    "close": "Leave with: a clear next step, a referral if needed, and an honest sense of where your health is at."
  },
  {
    "id": "starting-therapy-the-first-session",
    "category": "wellbeing",
    "number": 56,
    "title": "Starting therapy — the first session",
    "situation": "You've booked your first session with a therapist or psychologist. Here's how to make it useful rather than awkward.",
    "before": [
      "Write down what's been hardest. Read it before you go in.",
      "You don't have to know what you want from therapy. \"I don't know\" is a fine starting point.",
      "Give it at least three sessions before deciding if it's working."
    ],
    "opening": "I'm going through a separation. It's been [hard / complicated / better in some ways / worse in others]. I decided I needed to talk to someone.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The timeline",
        "example": "It's been [period] since we separated. Here's the rough shape of what happened."
      },
      {
        "heading": "What's been hardest",
        "example": "The part I'm struggling with most is [specific thing]."
      },
      {
        "heading": "What you want from this",
        "example": "I'm not entirely sure. Maybe to understand what I'm feeling. Maybe to get better at handling the hard parts."
      }
    ],
    "sideways": [
      {
        "trigger": "If you don't connect with the therapist",
        "response": "Give it two more sessions. If it still doesn't work, try someone else. Chemistry matters."
      },
      {
        "trigger": "If you feel like you're not saying anything useful",
        "response": "Tell them. \"I feel like I'm not getting to the real stuff. Can you ask me something?"
      },
      {
        "trigger": "If it feels pointless",
        "response": "That's normal in the first few sessions. Stay with it."
      }
    ],
    "close": "Book the next session before you leave. Consistency is most of what makes therapy work."
  },
  {
    "id": "telling-a-mate-youre-not-doing-well",
    "category": "wellbeing",
    "number": 57,
    "title": "Telling a mate you're not doing well",
    "situation": "You need to tell someone you trust that you're struggling — not a crisis, just an honest signal that things are harder than you've been letting on.",
    "before": [
      "Pick the right person. Someone who can hold it without panicking or immediately trying to fix everything.",
      "Do it in person or by phone. Not by text.",
      "Keep it proportionate. You're not announcing a crisis. You're being honest."
    ],
    "opening": "Hey — I've been putting on a reasonably good front, but I want to be honest with you. I'm not doing that well.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What's actually happening",
        "example": "I'm [sleeping badly / isolated / running on empty / not finding anything enjoyable]. It's been [weeks / a few months]."
      },
      {
        "heading": "What you're not asking for",
        "example": "I'm not asking you to fix it. I just wanted to say it out loud to someone I trust."
      },
      {
        "heading": "What would actually help",
        "example": "If you could [check in once a week / come for a run with me / just know what's going on] — that would help."
      }
    ],
    "sideways": [
      {
        "trigger": "If they immediately try to problem-solve",
        "response": "I appreciate that. I think I just needed to say it."
      },
      {
        "trigger": "If they get scared and ask if you're okay",
        "response": "I'm okay. It's not a crisis. I'm just not doing great."
      },
      {
        "trigger": "If they share something hard about themselves too",
        "response": "Let them. This is a conversation, not a speech."
      }
    ],
    "close": "Thanks for listening.\" That's it."
  },
  {
    "id": "asking-for-help",
    "category": "wellbeing",
    "number": 58,
    "title": "Asking for help",
    "situation": "You need help — practical, emotional, or financial — and you're finding it hard to ask. This is about reframing the ask.",
    "before": [
      "Know that most people feel useful when they help. Asking gives them that.",
      "Be specific. \"Any support you can give\" is not askable.",
      "Know you'd help them if the situation were reversed."
    ],
    "opening": "I need to ask for some help and I'll be honest — it doesn't come naturally to me. But [specific ask].",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific thing",
        "example": "Not \"support\" — a number, a task, a time, a yes or no."
      },
      {
        "heading": "Acknowledging it's a lot",
        "example": "I know it's a big ask. I wouldn't ask if I could sort it another way."
      },
      {
        "heading": "Giving them an out",
        "example": "If it's not possible, I'll completely understand."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say yes",
        "response": "Accept it. Don't minimise it. \"That genuinely means a lot."
      },
      {
        "trigger": "If they say no",
        "response": "No problem. Thanks for hearing me out."
      },
      {
        "trigger": "If it feels hard to do",
        "response": "It always does. Do it anyway."
      }
    ],
    "close": "Don't justify it to yourself afterwards. You asked. That's enough."
  },
  {
    "id": "talking-to-a-crisis-line",
    "category": "wellbeing",
    "number": 59,
    "title": "Talking to a crisis line",
    "situation": "Things have gotten to a point where you need to talk to someone and there's no one available right now. You've found a number. Here's what to say when it connects.",
    "before": [
      "You don't need to be in a defined crisis to call. These lines exist for people who are struggling — not just people at the edge.",
      "In Australia: Lifeline 13 11 14. Beyond Blue 1300 22 4636. MensLine 1300 78 99 78.",
      "You can hang up at any point."
    ],
    "opening": "I'm going through a separation. I'm not doing well tonight and I needed someone to talk to.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [],
    "sideways": [],
    "close": ""
  },
  {
    "id": "telling-your-landlord-youre-separating",
    "category": "admin",
    "number": 60,
    "title": "Telling your landlord you're separating",
    "situation": "You need to let your landlord know that the tenancy arrangement is changing — one person is moving out, or you want to take over the lease alone.",
    "before": [
      "Read your lease. Understand the terms around adding or removing a tenant.",
      "Know whether you can afford the rent alone.",
      "Don't give more personal detail than necessary."
    ],
    "opening": "I need to let you know about a change in my situation. My partner and I have separated. I want to talk through what that means for the tenancy.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you're asking for",
        "example": "I'd like to [continue the lease in my name only / negotiate an exit / transfer the lease]. What's the process?"
      },
      {
        "heading": "Your financial position",
        "example": "I can confirm I can cover the rent. My income is [amount / stable]. I'm happy to provide evidence."
      },
      {
        "heading": "Timing",
        "example": "I'd like to have this resolved by [date]."
      }
    ],
    "sideways": [
      {
        "trigger": "If they say both tenants need to agree to changes",
        "response": "I understand. Can you tell me the formal process? I'll work through it properly."
      },
      {
        "trigger": "If they want to terminate the lease",
        "response": "Can we discuss an alternative? I'd prefer not to have to move if the financials work."
      }
    ],
    "close": "Get everything in writing. A lease change needs to be documented — not just agreed verbally."
  },
  {
    "id": "renting-without-a-solo-rental-history",
    "category": "admin",
    "number": 61,
    "title": "Renting without a solo rental history",
    "situation": "You need to rent alone, but your rental history is tied to a joint application. You need to present yourself as a solid applicant.",
    "before": [
      "Gather evidence of income stability: payslips, employment letter, bank statements.",
      "Get a reference from your current or previous landlord if possible.",
      "Be upfront about the separation — it explains the application history without oversharing."
    ],
    "opening": "I'm applying as a sole applicant. I want to address something upfront: my rental history is from a joint tenancy, which ended due to a separation.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "Your stability",
        "example": "I've been employed at [company] for [period]. My income is [amount]. I can provide three months of statements."
      },
      {
        "heading": "Your track record",
        "example": "The previous tenancy was clean with no issues. I can provide a reference from the landlord."
      },
      {
        "heading": "What you're offering",
        "example": "I'm prepared to [pay in advance / provide extra references / offer a higher bond] if that helps."
      }
    ],
    "sideways": [
      {
        "trigger": "If they're hesitant about the joint history",
        "response": "I can provide my portion of the rental history and a reference that's specifically about me."
      },
      {
        "trigger": "If they're charging a premium for a solo applicant",
        "response": "Decide if it's worth it. Sometimes it is."
      }
    ],
    "close": "Follow up. Application processes favour people who are easy to deal with. Be responsive, thorough, and professional."
  },
  {
    "id": "explaining-your-situation-to-services-australia",
    "category": "admin",
    "number": 62,
    "title": "Explaining your situation to Services Australia",
    "situation": "You need to update Services Australia (Centrelink) about your separation — to access payments you're entitled to, update your tax status, or adjust child support.",
    "before": [
      "Know what payments you're applying for or updating: single parent payment, family tax benefit, child support.",
      "Have the relevant documents: proof of separation, income details, kids' details.",
      "These calls can be long. Call when you have time and energy."
    ],
    "opening": "I'm calling to update my family situation. My partner and I have separated as of [approximate date]. I need to update my details and understand what payments I might be entitled to.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The key change",
        "example": "We separated on [date]. I have [number] children aged [ages]. I'm the [primary / equal] carer."
      },
      {
        "heading": "What you want to know",
        "example": "What am I entitled to as a single parent? And how does child support get calculated from here?"
      },
      {
        "heading": "What you need from them",
        "example": "Can you tell me what I need to submit and how long processing takes?"
      }
    ],
    "sideways": [
      {
        "trigger": "If it takes forever",
        "response": "Ask for a reference number and call back. Ask what the decision timeframe is."
      },
      {
        "trigger": "If you get contradictory information",
        "response": "Ask to speak to a supervisor or request a formal decision in writing."
      },
      {
        "trigger": "If you're owed back-payments",
        "response": "Ask specifically about backdating eligibility."
      }
    ],
    "close": "Get a reference number for the call. Note the date and the name of the person you spoke to."
  },
  {
    "id": "a-utilities-account-in-your-exs-name",
    "category": "admin",
    "number": 63,
    "title": "A utilities account in your ex's name",
    "situation": "The electricity, gas, or internet is in your ex's name and you need to either transfer it or set up a new account.",
    "before": [
      "Ideally, have your ex call to transfer it. If they won't, open a new account yourself.",
      "Know the account details, meter number, and property address.",
      "If they cancel a service in their name, you may lose continuity. Have a backup ready."
    ],
    "opening": "I'd like to open a new account for [address]. The current account is in my partner's name — we've separated. I'd like to start my own account from [date].",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The basic details",
        "example": "Property address, meter details, start date."
      },
      {
        "heading": "Your identity and payment",
        "example": "Set up direct debit. Get a concession if you're eligible."
      },
      {
        "heading": "Continuity",
        "example": "Is there anything I need to do to ensure there's no gap between the current account and mine?"
      }
    ],
    "sideways": [
      {
        "trigger": "If they say you need the current account holder's permission",
        "response": "I understand. Can you open a new account from [date] regardless?"
      },
      {
        "trigger": "If there's a debt on the existing account",
        "response": "I'm not responsible for debts on an account I'm not named on. I'd like to open a clean account."
      }
    ],
    "close": "Get a confirmation email with the account number and start date. Set up automatic payments so it's one less thing to think about."
  },
  {
    "id": "discussing-relocation",
    "category": "high-stakes",
    "number": 64,
    "title": "Discussing relocation",
    "situation": "One of you wants to move to another city or region. This is one of the highest-stakes conversations in co-parenting — it affects the parenting arrangement fundamentally.",
    "before": [
      "Know your legal position. In Australia, a parent cannot relocate with a child against the other parent's wishes without court approval if there's a parenting order in place.",
      "Have a clear proposal, not just an announcement.",
      "Know this conversation is unlikely to go smoothly. Don't expect it to."
    ],
    "opening": "I want to talk about something important. I'm considering moving to [location]. I know that affects us both and I want to talk through it properly before anything is decided.",
    "openingAlt": "I need to understand what you're thinking. What does this look like for the kids' time with me?",
    "openingAltLabel": "If they want to move:",
    "cover": [
      {
        "heading": "The proposal and reasoning",
        "example": "Here's what I'm thinking and why: [reason — family support, job, housing]. I'm not trying to cut you out. I'm trying to solve [problem]."
      },
      {
        "heading": "The impact on the kids",
        "example": "I've thought about how this affects their time with you. What I'm proposing is [arrangement]."
      },
      {
        "heading": "Process",
        "example": "I don't think we can resolve this in one conversation. I'd like to get a mediator involved."
      }
    ],
    "sideways": [
      {
        "trigger": "If they threaten to go straight to court",
        "response": "That's your right. I'd rather we tried mediation first — it's faster and cheaper."
      },
      {
        "trigger": "If they refuse to discuss it",
        "response": "I understand you need time. But this isn't going away. I need to plan, and you deserve to be part of that conversation."
      },
      {
        "trigger": "If you found out they're planning to move",
        "response": "I need to understand the full picture before I respond. When were you planning to tell me?"
      }
    ],
    "close": "Get a formal process started — mediation or legal advice. Don't let this sit unresolved."
  },
  {
    "id": "when-a-new-partner-is-moving-in",
    "category": "high-stakes",
    "number": 65,
    "title": "When a new partner is moving in",
    "situation": "Your new partner is moving in with you, and your children spend time in your home. Your co-parent needs to know before the kids tell them.",
    "before": [
      "Make sure the kids are comfortable first. This is a significant change for them.",
      "Give your co-parent notice. Not asking permission — giving notice.",
      "Know your parenting order. Some orders specifically address who may reside in the home."
    ],
    "opening": "I want to let you know that [name] is going to be living with me. I'm not asking for your permission — I'm telling you so you're not blindsided, and because it involves the kids' home.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The timeline",
        "example": "This is happening from [date]. The kids know."
      },
      {
        "heading": "How it affects co-parenting",
        "example": "It doesn't change the parenting arrangement. [Name] won't be taking on a parenting role."
      },
      {
        "heading": "What you're asking from them",
        "example": "I'd ask that you don't make the kids feel like they have to take sides on this."
      }
    ],
    "sideways": [
      {
        "trigger": "If they react badly",
        "response": "I hear that this is hard. I'm not going to argue about my home arrangements."
      },
      {
        "trigger": "If they threaten a custody change",
        "response": "If you want to pursue that formally, that's your choice. I believe this is within my rights."
      },
      {
        "trigger": "If they bring it up with the kids",
        "response": "Address it directly: \"I'd ask you not to put the kids in the middle of our adult stuff."
      }
    ],
    "close": "Keep it short. You've done the right thing by telling them."
  },
  {
    "id": "changing-the-parenting-order",
    "category": "high-stakes",
    "number": 66,
    "title": "Changing the parenting order",
    "situation": "The existing parenting order no longer works — because circumstances have changed, the kids are older, or the arrangement needs updating. You want to change it.",
    "before": [
      "Know exactly what change you want and why.",
      "Get legal advice before this conversation. Understand your options.",
      "Changes to a parenting order in Australia can be made by consent or by court application."
    ],
    "opening": "The current arrangement isn't working anymore. I'd like to talk about changing it. I think we can do this by consent rather than going back to court.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "What you want to change",
        "example": "Specifically, I'd like [the schedule to change / the holidays to be restructured / a different arrangement for [child]]."
      },
      {
        "heading": "Why",
        "example": "The reason is [specific change — kids are older, school has changed, one parent's work situation has changed]."
      },
      {
        "heading": "The process",
        "example": "If we can agree, we can formalise it through a consent order. That's faster and cheaper than a hearing."
      }
    ],
    "sideways": [
      {
        "trigger": "If they resist any change",
        "response": "I'm not asking you to agree today. I'm asking you to consider it."
      },
      {
        "trigger": "If they want to change more than you do",
        "response": "Let's be specific about what we each want. I'm open to compromise."
      },
      {
        "trigger": "If they refuse entirely",
        "response": "I'll need to get advice about my options if we can't agree."
      }
    ],
    "close": "If there's any agreement, get it in writing immediately. Don't assume a verbal agreement will hold."
  },
  {
    "id": "when-your-co-parent-isnt-following-the-agreement",
    "category": "high-stakes",
    "number": 67,
    "title": "When your co-parent isn't following the agreement",
    "situation": "The parenting arrangement is being ignored — late returns, missed handovers, kids kept during your time. You need to address it directly before it becomes a pattern.",
    "before": [
      "Keep a record. Dates, times, what was agreed, what happened.",
      "Know your order — what specifically was violated.",
      "Keep your tone factual. This isn't a fight. It's a record."
    ],
    "opening": "I need to raise something. The arrangement on [date] didn't happen as agreed — [specific detail]. This is the [second / third] time. I want to deal with it now rather than let it build.",
    "openingAlt": null,
    "openingAltLabel": null,
    "cover": [
      {
        "heading": "The specific incidents",
        "example": "On [date], [what was agreed] didn't happen. On [date], same thing. I have the details."
      },
      {
        "heading": "What you're asking for",
        "example": "Going forward, I need [specific behaviour] to be followed. That's what we agreed to."
      },
      {
        "heading": "The consequence if it continues",
        "example": "If this keeps happening, I'm going to need to get advice and potentially go back to court. I'd rather not do that."
      }
    ],
    "sideways": [
      {
        "trigger": "If they deny it happened",
        "response": "I have the dates. I'm not interested in arguing about whether it happened — I just want it not to happen again."
      },
      {
        "trigger": "If they counter with their own grievances",
        "response": "Let's deal with those separately. Right now I'm asking about [specific issue]."
      },
      {
        "trigger": "If they agree but it continues",
        "response": "Document it formally. Speak to a lawyer."
      }
    ],
    "close": "Get their acknowledgment: \"So we agree that going forward, [specific thing]?\" If you can't get agreement, document the conversation and seek legal advice."
  },
  {
    "id": "explaining-family-dispute-resolution-or-court-to-your-kids",
    "category": "high-stakes",
    "number": 68,
    "title": "Explaining family dispute resolution or court to your kids",
    "situation": "You and your co-parent are going to FDR mediation or court, and the kids have found out or need to know. They're scared and confused.",
    "before": [
      "Keep it age-appropriate. Younger kids need less; older kids can handle more.",
      "Don't use this conversation to express frustration about the other parent.",
      "Reassure them of the one thing they actually care about: they are not the cause, and they will still have both parents."
    ],
    "opening": "Mum and Dad are going to meet with some people who help parents sort out their arrangements. It's a normal thing that a lot of families do.",
    "openingAlt": "I want to tell you what's happening, because you've heard about it and I don't want you to fill in the blanks with something worse.",
    "openingAltLabel": "Older kids:",
    "cover": [
      {
        "heading": "What it is",
        "example": "[Mediation / court] is a process where parents get help working out an arrangement for you. It's not about deciding who's the better parent. It's about working out the schedule and the plan."
      },
      {
        "heading": "It's not about them",
        "example": "You haven't done anything wrong. This has nothing to do with you."
      },
      {
        "heading": "What happens to them during it",
        "example": "While this is happening, your life stays the same. You still see both of us. Nothing changes day to day."
      }
    ],
    "sideways": [
      {
        "trigger": "If they ask who's going to win",
        "response": "It's not about winning. It's about working out what's best for you."
      },
      {
        "trigger": "If they ask if you're going to fight",
        "response": "We're not fighting. We're trying to agree."
      },
      {
        "trigger": "If they're angry at one parent",
        "response": "I understand. But I'm not going to say anything bad about [other parent]. They love you."
      }
    ],
    "close": "Return to the routine. The fastest way to reassure a child is to show them their day is intact. \"Tonight is normal. Let's have dinner.\" Atlas — a free planning tool for people navigating separation. Your data stays on your device."
  }
];
