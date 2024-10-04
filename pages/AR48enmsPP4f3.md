---
title: Watchman vs. Bodyguard
date: 2024-09-08T10:09:35.828Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://er4hn.info/blog/2023.04.29-watchman_bodyguard/'
---

> Two categories of security: The Bodyguard vs The Watchman

I'm going to start by making a bold and sweeping claim: Pretty much every product, feature, and tool in cyber security can be divided into two categories. These are the "watchman" and the "bodyguard". Knowing how these categories work is important, because it lets you determine the best way to solve problems. Like choosing between a hammer and a screwdriver, the right tool is needed for the job. Choosing the wrong one, such as a bodyguard when a watchman is better suited, will result in ineffective or frustrating security controls.

Bodyguards are analogous to their real life counterparts: They stand in between a VIP and all potential threats, shielding the VIP from harm. The VIP can vary from being as big as an entire running operating system, to as small as a single TLS connection. Bodyguards are defined as: That which examines an event, before it occurs, and decides if the event should proceed or not. Examples of bodyguard systems include: anti-virus, login portals, and firewalls. I'd even include protocols like TLS or SSH as bodyguards: If the connection is tampered with, the protocol will detect that tampering and handle it appropriately.

Watchmen, drawing analogies to the real world again, examine the state of the world and make observations based on what they see. One can imagine a night watchman strolling through a warehouse and checking for broken windows to note in their report. Watchmen are defined as: That which examines an event, after it occurred, and decides if it warrants further investigation or not. Examples of watchman systems include: log scanners, systems that measure hashes of files, systems which check configurations across services, AI based intrusion detection systems, and services which rotate keys after confirming a service appears to be behaving as expected.

The law of the 🔨 says "If the only tool you have is a hammer, it is tempting to treat everything as if it were a nail." As everyone familiar with this saying knows, that does not mean the hammer is always the appropriate solution. If you need to protect a VIP from being kidnapped, a watchman who will radio in an hour after it occurs and say "yeep, they're gone" is not the correct person for that job. So then why do we keep on ending up with mismatches like these:

* Usage of a break-glass account can only be audited by reading logs for it being logged into.
* Software on a laptop examines every site you go to and blocks known "file sharing sites" such as Dropbox, because they could be used to exfiltrate company data. It is my belief that these mismatches arise from a series of people, ending with the end users of these tools, not understanding what is the proper tool for a job.

Bodyguards work best when a clear decision can be made quickly. AuthN and AuthZ services fit this well because they don't normally deal with ambiguity. You either can clearly prove an identity and have that map to permissions, or there is a clear failure. Firewalls are another bodyguard style tool because they have clearly defined rules for processing packets. Bodyguards begin to fall apart when there is ambiguity: Trying to decide if a *never before seen* set of ioctl calls represents suspicious behavior (and should be stopped) is an example where bodyguards fail to work properly. Those decisions are best left to watchmen.

Watchmen work best at flagging potential issues after they have happened. Log analysis services are a straightforward example. Logs are produced after events occur, and log analysis services read those logs later on to look for suspicious behavior. Any sort of suspicious behavior is then flagged for further follow up by humans. Anything that can be examined after it occurs is a watchman service. Checking for files being changed from their expected value, configuration drift, nearly anything involving using AI/ML to find problems among large amounts of data, these are all watchmen. The key items that separate watchmen from bodyguards are that they operate after an event occurs and they make fuzzy, ambiguous, decisions.

Returning to the prior examples of mismatches, the vocabulary to describe the issue is now present. Now the question can be asked: What was wrong with them?

The first example was a break-glass account that could only be audited by checking logs to see if it was logged into. This is a watchman solution, but it's not the ideal one. Tech analogies follow from the real world and glass is only broken (i) in the event of an emergency, (ii) that breaking makes a noise, and (iii) it is obvious afterwards it broke. (i) is situational and outside the scope of discussion. (iii) is what the logs, mostly, fulfill. That leaves (ii), which is not accounted for. Logs that appear afterwards, and can be tampered with or overlooked, are not a big noise. What should happen is that a bodyguard system will determine if someone is even to be given access to the break-glass account and make a big explicit noise, such as email'ing a special alias or explicitly triggering a high priority SIEM event.

The second example was a service, running on a laptop, that would block access to "file sharing" sites to prevent exfiltrating data. This is a bodyguard, which is being forced to make decisions that are not suitable for it. If someone wants to exfiltrate data, there are an infinite number of sites one could visit. An adversary could even create a new site on the fly. Because of this a denylist won't work. An allowlist would only work under limited circumstances where every possible site to be accessed was known in advance. That leaves making a decision by listening in on all interactions with a visited site and making constant judgement calls about if the dialogue was the site is suspicious or not. This has reached fuzzy territory, which is why it is a bad place for a bodyguard. It would be better to accept that exfiltration could only be detected after the fact and rely on watchman services to review the data gathered and decide if further investigations are needed.

With this categorization every new security tool can now be evaluated to see if it is a watchman or a bodyguard. After categorizing it can be determined: Is it solving the problem correctly? Is it the right tool? And if not it can be put down and a more appropriate one found.

  