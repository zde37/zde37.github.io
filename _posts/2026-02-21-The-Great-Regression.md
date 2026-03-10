---
layout: post
title: "The Great Regression: How Quality Died While We Were Told Things Were Getting Better"
description: "A critical examination of how quality has systematically declined across software, healthcare, manufacturing, construction, education, and beyond, while being marketed as progress".
tags: [Software, Tech, Culture, Quality]
---

# The Great Regression: How Quality Died While We Were Told Things Were Getting Better

---

Your great-grandmother's washing machine lasted 30 years. Yours will last 10 if you're lucky, and you can't fix it yourself because the screws are proprietary. Her doctor knew her family, spent an hour with her, and treated the person, not the billing code. Yours gets a few minutes, and half of that goes to updating an electronic health record so the insurance company can be invoiced correctly. Her food was just food. Yours needs a special label, "organic", and a 3x price premium to be what all food was before industrial processing degraded the default. Her software, well, she didn't have software. But when software did arrive, a word processor opened instantly on hardware thousands of times weaker than what you carry in your pocket. Your modern equivalent, running on a machine that could simulate the Apollo moon landing, occasionally freezes while trying to render a dropdown menu.

Something went wrong. Not all at once, and not everywhere, but broadly and systematically enough that the pattern is unmistakable. Quality, durability, craftsmanship, genuine usefulness, these have been in steady decline across nearly every sector you can name. And the decline hasn't been passive. It's been packaged, marketed, and sold as improvement.

This isn't nostalgia. The data supports it. Let me show you.

## The Incentive Engine: How Quality Became the Enemy

Before we get into specific sectors, we need to understand the engine that drives all of this. There's a clean dividing line in modern economic history, and it runs through the shift from owner-operated businesses to shareholder-driven corporations managed by rotating professional executives.

When a founder builds a refrigerator, their name is on it. Their reputation is the product's reputation. There's a direct incentive to build something that lasts, because a customer who buys a reliable product tells their neighbors, and a product that fails carries the founder's name into the complaint. The feedback loop is tight: bad product, damaged reputation, lost business, personal consequence.

When a CEO is hired on a 3-5 year contract and compensated primarily in stock options, the incentive structure inverts completely. Durability is the enemy. A washing machine that lasts 30 years is a customer you don't see again for three decades. A washing machine that lasts 8 years, just past the warranty, is a repeat buyer. The CEO who engineers that transition gets rewarded with a rising stock price and moves on before the reputational cost arrives. The feedback loop is broken: the person making the decision won't face the consequences.

This isn't an aberration. It's the system working as designed. Public companies are structurally compelled to grow quarterly. Fiduciary duty to shareholders isn't a suggestion, it's a legal obligation. And quality that lasts is hostile to growth, because it reduces the frequency of repurchase. The system selects for leaders who understand this and act accordingly.

Layer on top of this the shift to "Everything as a Service", and the picture gets worse. The global XaaS market was [valued at $500 billion in 2024 and is projected to reach $4.5 trillion by 2035](https://www.marketresearchfuture.com/reports/everything-as-a-service-xaas-market-19265). That's not a trend. That's a fundamental restructuring of the relationship between producer and consumer, from ownership to perpetual rental. You don't buy software anymore, you subscribe to it. You don't own the features in your car, you lease access to heated seats your vehicle already has installed. You don't purchase a product, you enter a revenue stream.

Adobe Creative Suite used to cost roughly $2,600 as a one-time purchase. Now it's Creative Cloud: subscription-only, with [subscriptions comprising approximately 94% of Adobe's total revenue](https://www.adobe.com/investor-relations.html). Microsoft Office was a $150-400 purchase. Now it's Microsoft 365, with [nearly 90 million consumer subscribers](https://www.microsoft.com/en-us/investor/earnings/fy-2025-q4/productivity-and-business-processes-performance). The product didn't get 90 million users better. The business model got 90 million users more extractable.

With that engine understood, let's look at what it's producing across every sector it touches.

## Manufacturing: Designed to Fail

### Planned Obsolescence by the Numbers

Planned obsolescence isn't a conspiracy theory. It's a documented, studied, and in some cases openly admitted business strategy.

A Norwegian study published in the [_Journal of Industrial Ecology_ (2025)](https://onlinelibrary.wiley.com/doi/10.1111/jiec.13608) tracked appliance lifespans over decades with rigorous methodology. The findings:

- Washing machine lifetimes dropped from 19.2 years to 10.6 years, a **45% decline**
- Oven lifetimes fell from 23.6 years to 14.3 years, a **39% decline**
- The study controlled for usage patterns and even accounting for modern households running more wash cycles, per-cycle durability still decreased

The engineering choices behind this are deliberate. Glued-in batteries that can't be replaced without destroying the device. Proprietary screws that require tools no consumer owns. Sealed units that can't be opened for repair. Software locks that brick hardware when unauthorized repairs are detected. These aren't cost-saving compromises. They're design decisions that trade product longevity for repurchase frequency.

Apple is a case study in escalation. In 2015, the iPhone had 2 serialized parts, components paired to specific devices in ways that prevent third-party replacement. By 2020, [that number had grown to 9](https://www.ifixit.com/News/69320/how-parts-pairing-kills-independent-repair). Replace a battery with a non-Apple part and you get the message: "Unable to Verify This Genuine Apple Part". Replace a screen on an iPhone and Face ID stops working entirely, not because the display is connected to the Face ID hardware, but because Apple's software refuses to recognize a new part that hasn't been blessed by their system. This is a company that turned a functional repair into a permission request.

Their Independent Repair Provider program, created under legislative pressure, [requires shops to submit to unannounced Apple audits](https://www.vice.com/en/article/apples-independent-repair-program-is-invasive-to-shops-and-their-customers-contract-shows/), share customer names, phone numbers, and home addresses with Apple, and pay $1,000 per transaction if more than 2% of their work involves "prohibited products". If a provider leaves the program, Apple can inspect the shop for up to five years afterward. This isn't a repair program. It's a surveillance and compliance regime designed to make independent repair economically unviable while appearing cooperative.

### The Right to Fix What You Own

John Deere turned this dynamic into an international scandal. Modern tractors contain electronic control units that only authorized dealers can access. Farmers, people who have repaired their own equipment for centuries, are locked out of the machines they legally own. The financial impact is staggering: [U.S. PIRG estimated farmers lose $3 billion annually](https://pirg.org/edfund/resources/out-to-pasture/) to tractor downtime and pay $1.2 billion more in excess repair costs due to dealer lock-in.

In January 2025, [the FTC sued John Deere](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-states-sue-deere-company-protect-farmers-unfair-corporate-tactics-high-repair-costs) over these practices. Farmers have resorted to using cracked firmware from Eastern European hackers, particularly from Poland and Ukraine, to repair their own property. In 2022, when Russian forces stole $5 million worth of John Deere equipment from a dealership in Melitopol, Ukraine, and shipped it 700 miles to Chechnya, Deere remotely bricked the stolen machines via GPS. The same remote-disable capability that protected against theft overseas is exactly what farmers are fighting against at home: the principle that the manufacturer maintains ultimate control over hardware you purchased.

Farmers pirating Eastern European firmware to fix tractors they legally own. That's not progress. That's feudalism with better marketing.

### Fast Fashion: The Clothing Collapse

The garment industry tells the same story at a different scale. In the United States in 1960, 64% of fibers used in textiles were cotton. By 1970, the ratio had reversed: 58% synthetic, 39% cotton. The pattern repeated worldwide. Today, [synthetic fibers account for over 69% of all textiles produced internationally](https://www.tandfonline.com/doi/full/10.1080/17569370.2023.2196158), with polyester alone making up approximately 83% of that share. Polyester undercut natural fabrics by 30-50% on price, and the industry, from factories in China and Bangladesh to retailers in Europe and North America, followed the money.

[Shein](https://nielseniq.com/global/en/insights/analysis/2023/shein-zara-hm-close-up-on-the-ultra-fast-fashion-market/), the extreme case, adds between 2,000 and 10,000 new items to its app every single day. From November 2022 to November 2023, Shein introduced 1.5 million products to the market, 37 times more than Zara and 65 times more than H&M. The design-to-availability cycle is as short as 10 days. Nobody is pretending this is quality. But the volume creates an illusion of abundance that masks what's been lost.

The waste tells the final story. Of the [100 billion garments produced globally each year, 92 million tonnes end up in landfills](https://www.unep.org/news-and-stories/blogpost/why-fast-fashion-needs-slow-down), the equivalent of a garbage truck of clothing dumped every second. We've built a system that produces enormous volumes of clothing that falls apart fast enough to guarantee continuous repurchase, and the externalities, the mountains of synthetic waste in landfills, are somebody else's problem.

## Construction: Bigger, Cheaper, Worse

Across much of the developed world, homes have grown in size while shrinking in build quality. The pattern is most documented in the US, where average new home square footage went from 983 sq ft in 1950 to a peak of [2,467 sq ft in 2015](https://www.census.gov/content/dam/Census/programs-surveys/ahs/working-papers/Housing-by-Year-Built.pdf), but similar trends have played out wherever mass-produced housing replaced craft construction.

### Material Substitutions

The shift from plaster to drywall happened after World War II, driven by speed and cost. Plaster walls can last decades to centuries, are denser, provide superior soundproofing and fire resistance. They require skilled tradespeople to install. Drywall can be hung by relatively unskilled labor at a fraction of the cost. The industry chose speed and cost. The homeowner got walls that dent when you bump them with furniture.

OSB (oriented strand board) has replaced plywood as the standard sheathing material. While structurally equivalent per building codes, OSB is significantly more moisture-sensitive. Irreversible edge swelling is the primary concern, and cut edges are rarely treated in the field. Louisiana-Pacific faced [class action lawsuits with payouts approaching $1 billion](https://www.lieffcabraser.com/defect/louisiana-pacific-siding/) over claims that their OSB siding was rotting on homes. The industry's answer to that wasn't to go back to plywood. It was to improve the OSB just enough to avoid the next lawsuit.

Vinyl siding replaced wood siding for the same cost-and-speed reasons. After 25 years, inspections have found major water damage and structural rot hidden underneath vinyl siding that homeowners were completely unaware of, because the vinyl concealed the deterioration while trapping moisture against the structure.

### The Lifespan Problem

Roofing tells the clearest version of this story. Asphalt shingles, the modern default, last 15-30 years. Slate roofs on older homes last 75-200 years. A slate roof installed in 1920 is likely still functional today. An asphalt roof installed in 2000 has probably been replaced at least once. The material that requires replacement every generation won out over the material that outlasts the building, because the upfront cost was lower and the replacement cost is somebody else's problem (usually the next owner's, or the same owner 20 years later with no memory of the trade-off they made).

Modern HVAC systems last 10-25 years, with most hitting 15-20. Older, simpler forced-air systems routinely lasted 25-30 years because there were fewer electronic components to fail. The modern systems are more energy-efficient, which is a genuine improvement, but they're also more complex, harder to repair, and shorter-lived. The energy savings over 15 years may not offset the cost of earlier replacement when you run the full lifecycle math.

McMansions, the mass-produced homes of 3,000+ square feet that proliferated from the 1990s onward, epitomize the entire pattern: maximum visual impressiveness, minimum structural integrity. Oversized rooms that are expensive to heat and cool, faux stonework applied to facades, mixed architectural styles chosen for curb appeal rather than coherence, and cheap materials behind the impressive front. They're the housing equivalent of fast fashion: designed to impress at the point of purchase and to be somebody else's problem when the flaws emerge.

## Software: The Rot Beneath the Surface

Software is where the regression is both most severe and most invisible. Because software improvements are real, constant, and genuinely useful, the simultaneous degradation hides in plain sight. You have to look at the mechanics to see what's happening beneath the shiny surface.

### The Abstraction Tax

Every generation of software development adds a layer of abstraction. Hardware, firmware, operating system, runtime, framework, meta-framework, build tool, deployment orchestrator, observability platform. Each layer was introduced to solve a real problem. Collectively, they've created a system where a modern "hello world" web application ships more code than the entire Apollo 11 guidance computer ran.

Niklaus Wirth formalized this in his [1995 IEEE article _"A Plea for Lean Software"_](https://cr.yp.to/bib/1995/wirth.pdf) with what became known as Wirth's Law: "Software is getting slower more rapidly than hardware is becoming faster". He attributed the original observation to Martin Reiser, who wrote: "The hope is that the progress in hardware will cure all software ills. However, a critical observer may observe that software manages to outgrow hardware in size and sluggishness".

Wirth identified the dynamic precisely: this wasn't inevitable. He called it "the plague of software explosion" and explicitly said it is "not a 'law of nature.' It is avoidable, and it is the software engineer's task to curtail it". The industry ignored him. It's been 30 years and the plague has only accelerated.

The numbers make the point better than any argument:

- WeChat: [457 KB in 2011, over 260 MB by 2022](https://pandaily.com/wechat-installation-package-expands-575-times-in-11-years/). A 575x increase for an app whose core function, messaging, hasn't fundamentally changed.
- Windows Task Manager: 85 KB on disk originally, now 6 MB on disk and roughly 70 MB of RAM, to display essentially the same process information.
- Wirth's experimental Oberon operating system, complete with editor and compiler: 200 KB. Windows 11: approximately 25 GB. A 125,000x increase.
- Average webpage: [93 KB in 2005, 2,652 KB in 2024](https://almanac.httparchive.org/en/2024/page-weight). A 2,750% increase. JavaScript per page doubled from roughly 300 KB to 613 KB in nine years. Yet page load times are roughly the same, not because pages got more efficient, but because bandwidth increased 66x to compensate for pages getting 28x heavier. The treadmill runs faster but goes nowhere.

Where did all that space go? Abstraction layers, compatibility shims, telemetry, feature flags for A/B testing, consent banners, analytics scripts, chat widgets, advertising trackers, and the accumulated weight of code written under time pressure and never cleaned up.

### The Electron Problem

The desktop application tells a particularly grotesque version of this story. Electron, the framework that lets developers build desktop apps using web technologies, bundles a complete Chromium browser engine, JavaScript runtime, GPU renderer, networking stack, and audio pipeline into every single application. An empty Electron app idles at 200-300 MB of RAM. A Tauri app doing the same thing uses 30-40 MB, roughly 10x less, because it uses the operating system's existing web renderer instead of shipping its own.

The real-world consequences: [Slack routinely consumes 600 MB to 2 GB of RAM](https://slack.engineering/reducing-slacks-memory-footprint/). Discord uses 1-4 GB despite the official claim of "under 1 GB". Microsoft has publicly admitted that [Teams "eats RAM on Windows doing nothing"](https://www.windowslatest.com/2025/11/27/microsoft-admits-microsoft-teams-eats-ram-on-windows-doing-nothing-and-fix-is-just-another-exe/), idling at roughly 1 GB. VS Code, considered one of the better-optimized Electron apps, still uses 200-500 MB.

If you run Slack, Discord, Teams, and VS Code simultaneously, which many knowledge workers do, you're running four separate Chromium browser instances consuming 4-8 GB of RAM combined. You downloaded what you thought were desktop applications. What you got were four copies of Google Chrome wearing different costumes.

Microsoft tried to fix Teams by migrating from Electron to WebView2, promising half the memory usage. The result: Teams still idles at roughly 1 GB. Microsoft's "fix" was, quite literally, adding another executable process.

### The Dependency Crisis

Modern software doesn't get built. It gets assembled from parts made by strangers. A typical Node.js project pulls in hundreds to thousands of transitive dependencies, each one a trust relationship with an unknown, usually unpaid maintainer somewhere in the world.

The consequences of this model have played out publicly and catastrophically:

**March 2016.** Developer Azer Koculu [unpublished `left-pad`](https://en.wikipedia.org/wiki/Npm_left-pad_incident), an 11-line utility package that left-pads strings, from npm after a naming dispute with Kik Messenger. Babel, React, and software used by Facebook, PayPal, Netflix, and Spotify broke simultaneously. npm had to take the unprecedented step of manually restoring a package against the author's wishes. An 11-line function brought down a meaningful fraction of the JavaScript ecosystem, because the ecosystem had organized itself around outsourcing even trivial operations to external dependencies.

**November 2018.** An attacker using the handle "right9control" [socially engineered control of the `event-stream` package](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident), which had 2 million downloads per week, from its burned-out, unpaid maintainer. On September 9, 2018, the attacker added a malicious dependency that specifically targeted Copay Bitcoin wallets to steal cryptocurrency. The backdoor went undetected for 2.5 months. The maintainer, who had long since lost interest in the package but felt unable to abandon it because so much depended on it, handed it off to the first person who asked. The industry that depended on his free labor couldn't be bothered to fund or audit it.

**March 2024.** The [xz/liblzma backdoor](https://en.wikipedia.org/wiki/XZ_Utils_backdoor), [CVE-2024-3094](https://nvd.nist.gov/vuln/detail/cve-2024-3094), CVSS 10.0, the maximum possible severity score. An attacker using the pseudonym "Jia Tan" spent three years, from November 2021 to February 2024, patiently building trust as a co-maintainer of xz Utils. Sock puppet accounts pressured the original maintainer (who had documented mental health struggles) to accept help. The attacker gradually introduced a backdoor that would have given remote code execution on most Linux systems running OpenSSH, by exploiting a chain through glibc's IFUNC mechanism to libsystemd to lzma to sshd.

The backdoor was caught by a single developer, Andres Freund at Microsoft, who noticed a 500-millisecond performance anomaly in SSH connections on Debian Sid and decided to investigate rather than ignore it. If he hadn't been curious about a half-second delay, this backdoor would have shipped to every major Linux distribution. Fedora 40 beta, Debian unstable, Kali Linux, and Arch Linux were already affected.

The pattern is clear: **the industry externalized its labor costs onto unpaid open-source maintainers, built critical infrastructure on their free work, and then neither funded, audited, nor supported them.** The xz incident wasn't a failure of open source. It was a failure of an industry that depends on volunteer labor for its foundations and then acts surprised when that foundation cracks under the weight of what was built on top of it.

### The Metrics Trap and the Death of Craft

Software quality used to be judged by functional criteria: does it work, is it fast, is it reliable, is it maintainable. Now it's judged by engagement metrics: daily active users, session duration, conversion rates, sprint velocity, deployment frequency.

These metrics don't just fail to measure quality. They actively select against it. A notification system that interrupts you 30 times a day scores high on engagement. A dark pattern that tricks you into a subscription scores high on conversion. A team that ships half-finished features behind feature flags scores high on deployment frequency. A "confirm shaming" dialog that says "No thanks, I don't want to save money" scores high on opt-in rates. Every one of these makes the product worse for the user and better on the dashboard.

Cory Doctorow coined the term ["enshittification"](https://pluralistic.net/2023/01/21/potemkin-ai/) in 2022 to describe the platform-specific version of this dynamic. It was named the [American Dialect Society's 2023 Word of the Year](https://americandialect.org/2023-word-of-the-year-is-enshittification/), which tells you how viscerally it resonated. Doctorow's formulation: "Here is how platforms die: first, they are good to their users, then they abuse their users to make things better for their business customers, finally, they abuse those business customers to claw back all the value for themselves". It's a three-stage extraction engine, and the only people it serves in the end are the shareholders.

Google Search is the canonical example. A [Leipzig University study (2024)](https://downloads.webis.de/publications/papers/bevendorff_2024a.pdf) monitored Google, Bing, and DuckDuckGo for a year across 7,392 product review queries. The findings were damning: the majority of high-ranking product reviews were affiliate marketing vehicles, and there was an inverse relationship between affiliate marketing use and content complexity, meaning the higher a page ranked, the lower its actual quality. The researchers concluded that "search engines seem to lose the cat-and-mouse game that is SEO spam". Google's March 2024 update aimed to reduce low-quality content by 40%, and they found that 50% of penalized sites were using primarily AI-generated content.

Users responded by adding "reddit" to their Google queries to find real human experiences rather than SEO-optimized slop. Google responded by cutting a deal with Reddit and prioritizing forum content in search results, a tacit admission that their own ranking algorithms couldn't surface authentic content anymore. The search engine that organized the world's information now needs Reddit to tell it which information is real.

### Agile Is Dead (Long Live Agility)

The Agile Manifesto was written in February 2001 by 17 software developers at the snowbird resort in Utah. It was a rebellion against the heavyweight, bureaucratic development processes that were crushing developer productivity and satisfaction. The manifesto was simple: individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, responding to change over following a plan.

Within a decade, the rebellion had been captured, commodified, and turned into exactly the kind of bureaucratic process it was rebelling against. The global enterprise agile transformation services market was [valued at $27.6 billion in 2022, projected to reach $142 billion by 2032](https://www.alliedmarketresearch.com/enterprise-agile-transformation-services-market). Over 2 million practitioners have been certified in SAFe (Scaled Agile Framework). 70% of Fortune 100 companies have certified SAFe professionals on-site. An industry built on "individuals and interactions over processes and tools" now generates billions from selling processes and tools.

The manifesto's own co-authors have said as much. Ron Jeffries, co-creator of Extreme Programming and a manifesto signatory, [wrote in 2018](https://ronjeffries.com/articles/018-01ff/abandon-1/): "When 'Agile' ideas are applied poorly, they often lead to more interference with developers, less time to do the work, higher pressure, and demands to 'go faster'". He coined the term "Dark Scrum" to describe what the methodology had become: "In Dark Scrum, power holders know better. They pile it on. They see that as their job: drive the team". On story points, the estimation technique that's become an industry obsession, Jeffries said: "I like to say that I may have invented story points, and if I did, I'm sorry now".

Dave Thomas, another manifesto co-author, was even more direct in his 2014 post ["Agile is Dead (Long Live Agility)"](https://pragdave.me/thoughts/active/2014-03-04-time-to-kill-agile.html): "The word 'agile' has been subverted to the point where it is effectively meaningless, and what passes for an agile community seems to be largely an arena for consultants and vendors to hawk services and products". He described forming an industry group around the manifesto's four values as "creating a trade union for people who breathe".

A developer empowerment movement became a management control framework and a certification industry worth tens of billions. The manifesto's values didn't change. The incentive structure around them did.

### Complexity as Job Security

There's a perverse dynamic in modern software architecture that rarely gets discussed openly: complexity justifies headcount, budgets, and consulting contracts. A system that requires 15 microservices, a Kubernetes cluster, a service mesh, and three dedicated teams to maintain is harder to cut than a clean monolith one senior engineer built and understands.

In March 2023, Amazon's Prime Video team [published a case study](https://navinprasadk.medium.com/how-amazon-prime-video-achieved-better-scaling-and-cost-savings-with-monolith-architecture-and-aws-9d1b1851de6d) revealing they had switched their video monitoring service from a distributed microservices architecture using AWS Step Functions to a monolith and reduced infrastructure costs by over 90%. The original architecture, built on the very cloud services Amazon sells, proved too costly and scaled poorly. By packing everything into a single process, they achieved massive savings and actually improved their scaling capabilities.

David Heinemeier Hansson (DHH), creator of Ruby on Rails, has been calling this out for years: "If you're unable to create a majestic monolith with basic programming tools like encapsulation and namespaces, you don't have what it takes to improve upon the situation with a distributed swarm of microservices. Your spaghetti code will just be on five different plates". He points out that GitHub and Shopify run their main applications as monoliths with millions of lines of code and thousands of engineers collaborating on them.

The incentive structure makes the over-engineering predictable. Learning Kubernetes and spinning up microservices looks better on a CV than quietly delivering a reliable monolith. Leadership rewards scale and architectural complexity because it's easier to sell "we built a distributed architecture with service meshes" than "we delivered a simple system that works". Promotions follow the former, even when the latter creates more value.

Nobody got promoted for saying "we don't need that". Plenty of people got promoted for introducing something the organization didn't need and then building a team to manage the complexity they created.

## The Internet We Lost

### Infrastructure Consolidation

The internet was designed to survive a nuclear attack. ARPANET's fundamental architecture was deliberately decentralized, with no single point of failure, so that communication could route around damage. This was a military requirement that became a design philosophy: resilience through distribution.

Now a meaningful portion of the internet runs on three cloud providers, routes through a handful of DNS resolvers, and caches behind a few CDN services.

On June 8, 2021, a single customer's routine configuration change triggered a latent bug in Fastly's CDN, [knocking out 85% of its network](https://www.fastly.com/blog/summary-of-june-8-outage). Numerous high-profile platforms, including the UK government and white house websites all went dark simultaneously. One company's one bug took down a significant fraction of the visible internet for roughly an hour.

In July 2024, a faulty software update from CrowdStrike disrupted Windows systems globally, [affecting over 8.5 million devices](https://www.crowdstrike.com/blog/statement-on-microsoft-outage/) and grounding flights, halting hospitals, and crippling financial services across the US and Europe for several hours. The incident was caused by a logic error in a "Rapid Response Content" file pushed directly through CrowdStrike’s own update platform, illustrating how a single centralized update can trigger a massive, cascading global failure.

On October 20 2025, [a massive Amazon Web Services (AWS) outage occurred](https://cxquest.com/aws-outage-what-caused-the-2025-internet-meltdown-and-its-global-cx-impact/), primarily affecting the US-EAST-1 region in Northern Virginia. The disruption was so widespread it was dubbed the "Largest Global Incident of 2025," generating over 17 million reports on Downdetector from more than 60 countries. AWS, hosting a massive share of internet traffic, turned a regional issue into a global disruption because so many services depend on its centralized cloud.

We took a resilient, distributed network and re-centralized it into a fragile dependency graph with single points of failure. And we called it "the cloud".

### Social Media: From Chronological to Algorithmic

The timeline of how social media feeds changed tells you everything about the priority shift:

- **2009:** Facebook introduced EdgeRank, the first major algorithm replacing chronological feeds.
- **March 2016:** Instagram switched from chronological to algorithmic. Twitter pushed "best tweets" to the top of feeds, triggering #RIPTwitter.
- **2018:** Instagram refined its algorithm to weight views, likes, comments, saves, and shares.

The Facebook Files, leaked by whistleblower Frances Haugen in October 2021, revealed [Facebook's own internal research](https://www.npr.org/2021/10/05/1043194385/whistleblowers-testimony-facebook-instagram): 32% of teen girls said that when they felt bad about their bodies, Instagram made them feel worse. 13.5% of UK teen girls said their suicidal thoughts became more frequent after starting on Instagram. 17% said it made their eating disorders worse. Facebook knew. Haugen [testified before the Senate](https://www.congress.gov/117/meeting/house/114054/documents/HHRG-117-IF02-20210922-SD003.pdf) that Facebook had the ability to make its platforms safer but chose not to because it would reduce engagement and therefore profits.

### Streaming: Re-Inventing Cable at Cable Prices

The promise of streaming was simple: pay for what you want, cut the cable bundle, save money. Here's what actually happened.

Netflix's standard plan went from $7.99 in 2010 to $17.99 in 2025, [a 125% increase across 10 price hikes since 2011](https://flixed.io/netflix-price-hikes). The global streaming market was [valued at roughly $131 billion in 2024 and is projected to reach $416.8 billion by 2030](https://www.grandviewresearch.com/industry-analysis/video-streaming-market). Netflix leads with [301.6 million subscribers worldwide](https://intelpoint.co/insights/over-500-million-people-subscribe-to-the-two-largest-streaming-services/).

But the real cost isn't any single service, it's the fragmentation. Content that used to be available on one or two platforms is now scattered across Netflix, Disney+, Hulu, Max, Amazon Prime Video, Apple TV+, Peacock, and Paramount+. Netflix prices [vary enormously by country](https://www.comparitech.com/blog/vpn-privacy/countries-netflix-cost/), but the fragmentation problem is universal: to access all major content, subscribers everywhere must pay for multiple services.

The industry is now doing what you'd expect: re-bundling. Disney offers a Disney+, Hulu, and ESPN package. The entire pitch was "escape the bundle". The entire trajectory is "recreate the bundle at a higher price with a worse interface". We disrupted cable. Then we rebuilt cable, but fragmented across eight apps with eight different search systems, eight different recommendation algorithms, and eight different auto-play behaviors, and charged more for the privilege.

## Healthcare: Where Extraction Meets Human Suffering

Manufacturing decline means your dishwasher breaks sooner. Software decline means your apps are slower and more annoying. Healthcare decline means people suffer and die. The stakes are categorically different, and the mechanics deserve scrutiny proportional to those stakes.

### The Chronic Disease Economy

Here's the fundamental tension in for-profit healthcare: a cured patient is a lost customer. A managed patient is a recurring revenue stream.

This doesn't require a conspiracy. It requires capital to follow return on investment. Research funding flows toward treatments for chronic conditions, diabetes management, long-term mental health medication, ongoing pain management, because the financial return is predictable and recurring. Chronic management is subscription revenue. Cure-oriented research struggles to attract comparable investment because the business model is a single transaction. When cure-oriented breakthroughs do emerge, they get priced astronomically precisely because the company needs to capture lifetime treatment value in one shot.

The results are visible in population data across every continent, and they're moving in the wrong direction:

- According to the WHO, [adult obesity has more than doubled since 1990, and adolescent obesity has quadrupled.](https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight) across all regions. The report shows that as of 2022, over 1 billion people live with obesity: 890 million adults and 160 million children. This isn't a Western phenomenon. Over 4 in 5 adults with diabetes live in low and middle-income countries, and in Africa, up to 65% of productive land is already degraded by the food systems feeding this crisis.
- The International Diabetes Federation, tracking [215 countries and territories](https://diabetesatlas.org/), reports diabetes prevalence has undergone a nearly 4-fold increase from 151 million (2000) to 589 million (2024). Over $1 trillion was spent on diabetes in 2024, [Total diabetes-related health expenditure](https://diabetesatlas.org/data-by-indicator/diabetes-related-health-expenditure/total-diabetes-related-health-expenditure-id-million/).
- The Global Burden of Disease Study, covering [204 countries](https://pmc.ncbi.nlm.nih.gov/articles/PMC11395616/), found depression cases rose from 172 million (1990) to 279 million (2019). Anxiety cases rose from 311 million to 458 million over the same period. The WHO reported a further [25% increase in anxiety and depression](https://www.who.int/news/item/02-03-2022-covid-19-pandemic-triggers-25-increase-in-prevalence-of-anxiety-and-depression-worldwide) during the first year of COVID-19 alone, with the steepest increases in the Americas and South-East Asia. Mental disorders remain among the top 10 leading causes of health burden worldwide, with no evidence of reduction in any region since 1990.


### The Shrinking Consultation

The [largest international review of consultation times](https://pmc.ncbi.nlm.nih.gov/articles/PMC5695512/), covering 28 million consultations across 67 countries, found staggering variation: 48 seconds in Bangladesh, 5 minutes in China, roughly 8-10 minutes across much of South Asia and sub-Saharan Africa, 15-18 minutes in the US and UK, and 22.5 minutes in Sweden. Eighteen countries, including India, Pakistan, Bangladesh, and China, representing approximately half the world's population, average 5 minutes or less per consultation. Only Sweden, Norway, and the US average 20 minutes or more.

You can't do meaningful root-cause diagnosis in 5 minutes, or even 15. What you can do is pattern-match symptoms to a treatment protocol and prescribe accordingly. The system doesn't produce bad doctors. It produces constrained doctors operating in structures that reward throughput over depth.

The doctors know this. A [Commonwealth Fund survey](https://www.commonwealthfund.org/publications/issue-briefs/2022/nov/stressed-out-burned-out-2022-international-survey-primary-care-physicians) covering Australia, Canada, France, Germany, the Netherlands, New Zealand, Sweden, Switzerland, the UK, and the US found that more than 1 in 3 physicians in 7 of these 10 countries reported feeling burned out. More than half of respondents in every country surveyed said workload had increased since the pandemic, and a good number (more than half) of older primary care physicians in most countries said they would stop seeing patients in the near future. A [systematic review of 182 studies across 45 countries](https://pmc.ncbi.nlm.nih.gov/articles/PMC6233645/) spanning North America, Europe, Asia, the Middle East, South America and Oceania confirmed burnout as a phenomenon that crosses every healthcare system, not an artifact of any single one.

### The Food System Feeding the Healthcare System

The connection between the food system and the healthcare system is rarely discussed as what it is: a self-reinforcing economic loop where one industry's output creates the other industry's demand.

A [systematic review of ultra-processed food consumption across multiple countries](https://www.foodnavigator.com/Article/2025/11/24/upfs-rise-in-poorer-countries/) found per capita sales surged 60% from 2007 to 2022, rising from 20.3 kg to 32.2 kg per person. The breakdown by region tells a clear story: in the US and UK, over 50% of dietary energy now comes from ultra-processed foods. In Canada it's 45-54%, Australia roughly 42%, France 17-33%, Brazil around 22%, and Italy sits lowest at 10-14%. Growth is stagnating in high-income North America and Western Europe but rapidly expanding across Latin America, the Middle East, and sub-Saharan Africa, meaning the same pattern is repeating with a time lag.

But it's not just the processing. The raw ingredients themselves have degraded. A [study by Professor Donald Davis at the University of Texas](https://pubmed.ncbi.nlm.nih.gov/15637215/) examined USDA nutritional data for 43 different vegetables and fruits, comparing 1950 values to 1999. The declines: protein down 6%, phosphorus down 9%, iron down 15%, vitamin C down 15%, calcium down 16%, vitamin A down 18%, riboflavin (B2) down 38%. A [parallel UK study covering 1940-2019](https://www.tandfonline.com/doi/full/10.1080/09637486.2021.1981831) found similar trends: sodium down 52%, iron down 50%, copper down 49%. A [2024 global review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10969708/) found an "alarming decline" in nutritional quality across fruits, vegetables, and food crops worldwide over the past 60 years.

The causes are systemic and span every agricultural region. [The UN and FAO report](https://news.un.org/en/story/2022/07/1123462) that 33% of the Earth's soils are already degraded, with over 90% projected to be degraded by 2050. In Africa, up to 65% of productive land is degraded, and desertification impacts 45% of the continent. In Europe, roughly 25% of land is at risk of desertification. In India, nearly two-thirds of land is under degradation. Erosion carries away [25 to 40 billion tonnes of topsoil](https://www.fao.org/about/meetings/soil-erosion-symposium/key-messages/en/) every year, the equivalent of one soccer pitch of earth every 5 seconds. It takes approximately 1,000 years to create just a few centimeters of topsoil. High-yield crop varieties have been bred for size and growth rate rather than nutritional density, creating a "dilution effect": more volume, less nutrients per unit. We've optimized agriculture for yield per acre, not nutrition per bite.

The loop: the food system produces cheap, nutritionally depleted, ultra-processed products that drive metabolic disease. The healthcare system manages that disease as a chronic condition, generating recurring revenue. The pharmaceutical industry provides the management tools: insulin, statins, antidepressants. Each industry's revenue depends on the continued output of the others. No coordination required. Just convergent incentives producing convergent extraction from the same population.

### Degrade the Default, Sell Back the Original

The wellness industry reveals the pattern at its most transparent. Consider what's being sold as innovation:

- **Sleep optimization devices** exist because artificial lighting, screens, and work schedules disrupted the circadian rhythms humans maintained naturally for millennia. You now need a $200 device and a subscription app to do what darkness and a consistent schedule provided for free.
- **Meditation apps** monetize a practice freely taught for thousands of years, repackaged as "mindfulness technology" with a monthly subscription. Headspace and Calm are worth billions. The practice they monetize is older than money.
- **"Organic" food** commands a premium for food that isn't contaminated with what industrial agriculture introduced. "Organic" is just the word for what all food was before we degraded the default.
- **Standing desks** and ergonomic equipment solve problems created by the sedentary knowledge-work environment that replaced physical labor.
- **Digital detox retreats** charge people to escape the technology that was sold to them as liberating.
- **Air purifiers** sell you clean air because the default air was degraded by the same industrial processes that produced the rest of the goods you're buying.
- **Noise-canceling headphones** sell you silence. Silence used to be the default state of the world.

The pattern: **create the condition, then sell the remedy.** Disrupt sleep with screens, sell a sleep tracker. Destroy attention with notifications, sell a focus app. Degrade food quality with processing, sell "clean" food at 3x markup. Each industry independently optimizes its own revenue in ways that create demand for another industry's products. No coordination required. Just convergent incentives producing convergent extraction.

### The Mental Health Dimension

The pharmaceutical approach to mental health deserves specific scrutiny. SSRIs and related medications genuinely help people in crisis. That is not in dispute. What's in dispute is the model that made them the default first-line treatment for conditions that often have environmental, social, and lifestyle roots.

If someone is anxious because they work 60 hours a week, can't afford housing, have no community, eat nutritionally depleted food, sleep poorly due to screen exposure, and haven't had a meaningful non-transactional human interaction in weeks, the accurate diagnosis is "rational response to material conditions". Medicating that response without addressing the conditions isn't treatment. It's making the person functional within a dysfunctional system. The medication becomes a subsidy to the employer and the economy, not a service to the patient.

Individual doctors and therapists often understand this. The system-level incentives override individual judgment. A 5-minute visit can produce a prescription. It cannot restructure a patient's relationship to work, community, food, and rest.


## AI in Software: Regression at Industrial Scale

### Vibe Coding: The Name Says Everything

In February 2025, Andrej Karpathy, co-founder of OpenAI, [posted on X](https://x.com/karpathy/status/1886192184808149383) what became the defining statement of a new development practice:

> "There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. I "Accept All" always, I don't read the diffs anymore. When I get error messages I just copy paste them in with no comment, usually that fixes it. It's not really coding, I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works".

The post was viewed over 6 million times. The term entered the industry vocabulary instantly. And the practice it describes, generating code without reading, understanding, or reviewing it, is now widespread.

Consider what [happened to Jason Lemkin](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/), founder of the SaaStr community, in July 2025. While using Replit's AI agent, the tool deleted a live production database during an active code freeze, wiping out data for more than 1,200 executives and over 1,190 companies. The AI agent then fabricated thousands of fake records and produced misleading status messages about what it had done. When questioned, the AI admitted to running unauthorized commands, panicking in response to empty queries, and violating explicit instructions not to proceed without human approval. 

This isn't an anecdote. It's a preview.

### The Security Evidence

The research on AI-generated code quality is consistent and troubling:

- A [Stanford study led by Dan Boneh's team](https://arxiv.org/abs/2211.03622) (published at ACM SIGSAC 2023) tested 47 participants across security-related tasks. Participants with AI assistance wrote **significantly less secure code** than those without it. The AI-assisted group was more confident in their code's security despite it being objectively weaker. Tasks involving string encryption and SQL injection were particularly affected.

- An [analysis of 733 Copilot-generated code snippets](https://arxiv.org/abs/2310.02059) found that **29.5% of Python and 24.2% of JavaScript outputs contained security weaknesses**.

- A broader [study across four major AI coding tools](https://arxiv.org/abs/2510.26103) (ChatGPT, Copilot, Amazon CodeWhisperer, Tabnine) identified **4,241 vulnerability instances across 7,703 files**, spanning 77 distinct vulnerability types.

- [Veracode's 2025 report](https://www.veracode.com/blog/genai-code-security-report/) found that **45% of AI-generated code contains security vulnerabilities.**

- LLMs [failed to secure code](https://www.csoonline.com/article/4116923/output-from-vibe-coding-tools-prone-to-critical-security-flaws-study-finds.html) against Cross-Site Scripting in **86% of cases** and Log Injection in **88% of cases**. Testing in December 2025 found **69 vulnerabilities across five popular vibe coding tools**, including half a dozen critical flaws.

- A [METR study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found developers **believe** AI makes them 20% faster but are **actually 19% slower** when measured objectively in a randomized controlled trial.

That last finding deserves emphasis. The perception of improvement is the opposite of the reality. People feel faster while producing slower, worse output. The confidence boost that AI provides is inversely correlated with the quality of what it produces. You feel more productive as you become less productive. You feel more secure in your code as it becomes less secure.

### The Marketing vs. The Reality

The narrative around AI in development runs on three claims. Each one collapses under examination.

**"10x productivity".** Measured how? Lines of code has been a discredited metric for decades, because the best code is often the code you delete, not the code you add. Features shipped? We've already established that feature velocity and quality are inversely correlated. If you define productivity as "volume of code produced", then yes, AI delivers. If you define it as "robust, maintainable, secure systems delivered", the evidence points the other direction. And if developers think they're 20% faster but are actually 19% slower, the "10x" claim isn't just wrong, it's inverted.

**"Democratizing coding".** This framing assumes the barrier to building software was the mechanical act of typing code. It wasn't. The barrier is understanding what code should do, why, how it can fail, what it should do when it fails, how it interacts with other systems, how it handles adversarial input, and how it will be maintained over time. That's engineering judgment. AI doesn't transfer engineering judgment. It transfers the ability to produce code-shaped text without the understanding that makes code reliable. Removing the constraint of needing to understand what you're building, without transferring the understanding itself, isn't empowerment. It's removing the guardrails on a mountain road and calling it "freedom".

**"Empowering everyone to build".** Build what? To what standard? With what maintenance commitment? A wave of AI-generated applications, integrations, internal tools, and automations is flooding organizations right now. Who audits them? Who maintains them when the person who prompted them into existence moves on? Who understands them well enough to debug them when they fail in production at 3 AM? "Everyone can build" without "everyone can maintain" is just a faster way to create technical debt.

### The Time Bombs

There are several fuses burning simultaneously, each on a different timeline.

**Security (short fuse, 1-3 years).** AI-generated code reproduces patterns from training data, including insecure patterns. Stanford's research showed this clearly. Junior developers using AI won't catch the vulnerabilities. Senior developers reviewing AI output at speed will miss some percentage. Multiply that miss rate across the industry. We won't see this as a single dramatic event. We'll see it as a steady, initially unexplained increase in breach frequency and severity. Attribution will be difficult because AI-generated code is indistinguishable from hand-written code, so the causal link will take years to establish empirically even as the damage accumulates.

**Institutional knowledge erosion (medium fuse, 5-10 years).** If junior developers learn by prompting rather than by building from fundamentals, they don't develop the deep understanding that produces senior engineers. The kind of understanding that lets you look at a system and know where it will break before it breaks. The kind that comes from having debugged a memory leak at 2 AM, not from having asked an AI to generate a function. This is a pipeline problem with a lag. The current generation of seniors still understands systems deeply. When they retire or leave, who replaces them? If the answer is "people who've been generating code rather than understanding it", we face an industry-wide loss of the expertise needed to maintain, debug, and evolve the systems everyone depends on.

**Architectural incoherence (medium fuse, 3-7 years).** AI generates code function-by-function, file-by-file. It doesn't hold a coherent architectural vision across a system. It doesn't remember what conventions it used in the file it generated last week unless you feed it the context. When many developers each generate their piece independently with AI, the result is a system that works locally but is incoherent globally, inconsistent patterns, redundant logic, conflicting assumptions, three different approaches to error handling in three different files. This is technical debt that compounds silently until the system becomes effectively unmaintainable, at which point someone proposes a rewrite, which will also be AI-generated, and the cycle repeats.

**Model collapse (long fuse, 5-15 years).** A paper published in [_Nature_ in July 2024](https://www.nature.com/articles/s41586-024-07566-y), by researchers including Ilia Shumailov and Ross Anderson, demonstrated that AI models trained on recursively generated data suffer irreversible defects. The tails of the original data distribution disappear first ("early model collapse"), then the entire distribution converges toward something that bears no resemblance to the original ("late model collapse"). The effect occurs across model types: LLMs, variational autoencoders, and Gaussian mixture models.

Future AI models will inevitably be trained on code that was itself AI-generated, because AI-generated code is now flooding every public repository, every Stack Overflow answer, every tutorial site. If the training data degrades, the output degrades, which becomes the next generation's training data. The baseline drifts downward and nobody has a clean reference point for what "good" looked like. The researchers found one mitigation: if synthetic data accumulates alongside human-generated data rather than replacing it, collapse is avoided. But that requires maintaining the supply of high-quality human-generated data, which is exactly what the "everyone can vibe code" movement is eroding.

### Why It's Being Marketed as Progress

Because the incentive structure demands it. AI companies need adoption to justify valuations measured in the hundreds of billions. Tech companies need productivity narratives to justify the layoffs that Wall Street rewards with stock price surges.

In 2023, [264,320 tech workers were laid off](https://layoffs.fyi/) across 1,193 tech companies. In 2024, another 152,922 across 551 tech companies. In 2025, 124,201 across 271 tech companies, driven by AI integration and cost-cutting initiatives. By 2026, the trend continued with 38,645 layoffs across 60 tech companies so far, as companies prioritized efficiency over headcount. Meanwhile: [Alphabet saw $350 billion in revenue for 2024, and $402 billion in revenue for 2025](https://www.statista.com/statistics/507742/alphabet-annual-global-revenue/) (up 15.09% from 2024). [Meta's annual revenue for 2025 was $200 billion, and $164 billion for 2024](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx). Microsoft achieved [record revenue of $281 billion in 2025 (up 15%), with net income at $101 billion](https://www.microsoft.com/investor/reports/ar25/index.html) and Amazon's net income reached [$77.7 billion in FY2025](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/), its highest yet. Projections for 2026 indicate continued revenue growth amid ongoing workforce reductions.

The result: managers need velocity metrics to justify their strategies. Developers need to stay employable in a market that demands AI fluency. Nobody in this chain is incentivized to say "this is producing worse software faster". Everyone is incentivized to say "this is the future, get on board or get left behind".

## The Unifying Pattern

Across every sector, the same mechanic repeats:

1. **Build something of genuine quality** to establish trust and market position.
2. **Gradually degrade the quality** while maintaining or increasing the price.
3. **Market the degradation as improvement** using language that sounds like progress: "innovation", "efficiency", "democratization", "disruption", "the future".
4. **When the degraded default becomes unbearable, sell the original quality back as a premium tier.**

This is how "organic" became a luxury label for what was once just food. How "artisanal" became a price multiplier for what was once just how things were made. How "premium support" became the term for what customer service used to be by default. How "ad-free" became a tier you pay extra for, when the absence of ads was the original state of every product. How "privacy" became a feature rather than a right.

The pattern is fueled by a set of incentive structures that reward extraction over craft, quarterly returns over long-term value, and growth metrics over genuine usefulness. When every actor in a system faces the same incentives, you get convergent behavior that looks coordinated even though it's emergent. Every CEO faces the same quarterly pressure. Every product manager faces the same "ship faster, cut costs" mandate. The behavior converges because the incentives converge.

The honest framing isn't "we traded quality for accessibility". We have the productive capacity for both. Global productive capacity has increased enormously. The constraint isn't physics or engineering capability. It's that durability is hostile to the revenue model. Genuine cures are hostile to recurring treatment revenue. Simplicity is hostile to the consulting and tooling ecosystems that profit from complexity. Understanding is hostile to the AI adoption metrics that justify valuations. Quality is hostile to growth, and growth is the only thing the system rewards.

## Survivorship Bias Isn't a Full Defense

The standard counterargument to everything above is survivorship bias: the old things we encounter today survived because they were well-made, while the poorly-made old things were discarded long ago. We compare the best of the past against the average of the present.

This is a real cognitive bias and it genuinely applies. Not every 1950s appliance was a marvel of engineering. Not every piece of old software was elegant. Not every historical building still stands. The poorly-made old things are in landfills and scrapyards, invisible to our comparison.

But survivorship bias is an insufficient defense for three reasons.

**First,** we can compare specifications and standards directly, not just surviving examples. 1920s masonry specifications versus modern drywall-over-stick-frame specifications are comparable on paper. Slate roofing versus asphalt shingles has a documented lifespan difference of 5-10x. The older specs win on longevity even if the newer specs win on cost and installation speed. The comparison doesn't require cherry-picking survivors.

**Second,** the floor dropped, even if the ceiling held. High-quality clothing still exists, it just costs 10x what it did relative to income. Durable appliances still exist, they're commercial-grade and priced for institutions, not consumers. Well-built homes still exist, they're custom-built at prices most people will never afford. The premium tier didn't disappear. It got priced out of reach. The accessible tier, the tier that most people actually interact with, measurably eroded.

**Third,** the decline is measurable in contemporary data, not just retrospective comparison. Washing machine lifespans [declined 45%](https://onlinelibrary.wiley.com/doi/10.1111/jiec.13608) in tracked studies. 45% of AI-generated code contains [security vulnerabilities](https://www.veracode.com/blog/genai-code-security-report/). These aren't nostalgic feelings about a golden age. They're trends in datasets, measured with contemporary instruments, showing deterioration in real time.

## Everything Old Is New

Technology architectures swing like a pendulum. We went from centralized mainframes (dumb terminals accessing shared compute) to decentralized personal computers (local processing, local storage) to centralized cloud computing (SaaS, thin clients accessing shared compute) and now toward edge computing and local AI models, marketed as revolutionary. We're rediscovering that putting compute closer to the user has benefits. The mainframe operators of the 1960s could have told us that the trade-offs of centralization are real. We just needed 60 years and several trillion dollars of cloud infrastructure investment to rediscover it.

Stoic philosophy from two millennia ago gets repackaged as a mindfulness app with a subscription tier. Apprenticeship, the millennia-old model of learning by doing under guidance, becomes a "mentorship program" with a certification. Fermented foods, preserved by every pre-industrial culture on earth, become a "gut health" trend with premium pricing. Whole foods become "clean eating", a premium lifestyle brand for what was simply eating before industrial processing made it necessary to distinguish.

The cycle isn't progress. It's rediscovery of fundamentals after a period of degradation, dressed up in new terminology to justify new pricing. We keep solving problems we created, calling the solutions innovations, and charging for access to what used to be the default state of things.

Across every domain we've examined, the same question emerges: if we have more productive capacity, more knowledge, more technology, and more resources than at any point in human history, why are so many outputs getting worse? The answer isn't capability. It's incentive. We can build things that last. We can write software that's lean and secure. We can grow food that's nutritious. We can educate students without burying them in debt. We can practice medicine with the depth that healing requires. We have the capacity for all of it.

The system we've built selects against all of it.

The incentives are structural, not personal. Good people inside these systems understand the decline, often more clearly than the critics outside. Physicians know a few minutes isn't enough. Engineers know the code is bloated. Teachers know the grades are inflated. Farmers know the soil is depleted. The people closest to the work see the degradation most clearly and are most constrained from addressing it, because the metrics they're evaluated by reward exactly the behavior that produces the decline.

Naming the pattern has value. "Enshittification" resonated for a reason: it gave millions of people a word for something they'd felt but couldn't articulate. The Norwegian appliance study, the Stanford AI security research, the Leipzig search quality analysis, these put numbers on what people sense intuitively, that things are getting worse even as they're told things are getting better.

The more precisely we can describe the mechanics, trace the incentive structures, and document the outcomes with data rather than nostalgia, the harder it becomes to market degradation as progress. That isn't a solution. But it's a precondition for one. You can't fix a pattern you can't name, and you can't name a pattern you haven't examined clearly.

So examine it clearly. And the next time someone tells you the new version is better, ask: better for whom?
