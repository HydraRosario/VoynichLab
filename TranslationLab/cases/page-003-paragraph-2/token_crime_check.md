# VoynichLab Etymology Metasearch

- dataset: manual token
- providers: wiktionary, wikipedia, datamuse
- cache: translator/cache/etymology

This is a candidate generator, not a proof. It gathers external lexical evidence and marks noisy roots instead of pretending every hit is meaningful.

## Ranked Roots

### crime

- paragraph count: 1
- levels: manual
- examples: manual
- confidence: 11.80
- status: inspect
- wiktionary languages: 6
- explicit etymology: yes

#### Wiktionary
- English | etymology yes
  - etymology: From , , from , , from . Displaced native .
  - def: A specific act committed in violation of the law, especially criminal law.
  - def: Any great sin or wickedness; iniquity.
  - def: That which occasions crime.
- Asturian
  - def: murder
- Dutch
  - def: hassle, struggle, pain in the neck
- French | etymology yes
  - etymology: , borrowed from , from , from , from + .
  - def: a category of severe offences within French law, comparable to a felony under United States laws. Crime are tied to the strongest of penalties, 10 years and more according to law.
- Italian | etymology yes
  - etymology: .
- Portuguese | etymology yes
  - etymology: , from .

#### Wikipedia
- Crime: In ordinary language, a crime is an unlawful act punishable by a state or other authority. The term crime does not, in modern criminal law, have any simple and universally accepted definition, though statutory definitions have been provided for certain purposes. The most popular view is that crime is a category created by law; in other words, something is a crime if declared as such by the relevant and applicable law. One proposed definition is that a crime or offence is an act harmful not only to some individual but also to a community, society, or the state. Such acts are forbidden and punishable by law.
- CRIME: CRIME is a security vulnerability in HTTPS and SPDY protocols that utilize compression, which can leak the content of secret web cookies. When used to recover the content of secret authentication cookies, it allows an attacker to perform session hijacking on an authenticated web session, allowing the launching of further attacks. CRIME was assigned CVE-2012-4929.
- Organized crime: Organized crime refers to transnational, national, or local groups of centralized enterprises that engage in illegal activities, most commonly for profit. While organized crime is generally considered a form of illegal business, some criminal organizations, such as terrorist groups, rebel groups, and separatists, are politically motivated. Many criminal organizations rely on fear or terror to achieve their goals and maintain control within their ranks. These groups may adopt tactics similar to those used by authoritarian regimes to maintain power. Some forms of organized crime exist simply to meet demand for illegal goods or to facilitate trade in products and services banned by the state, s

#### Datamuse
- crime: n (countable) A specific act committed in violation of the law, especially criminal law.; n (uncountable) Criminal acts collectively.
- prime: adj First in importance, degree, or rank.; adj First in time, order, or sequence.
- rime: n Archaic in the form rimes: originally, any frozen dew forming a white deposit on exposed surfaces; hoar frost (sense 1).; n (figurative) A film or slimy coating.
- grime: n Dirt, grease, soot, etc. that is ingrained and difficult to remove.; v To begrime; to cake with dirt.
- chime: n (music) A musical instrument producing a sound when struck, similar to a bell (e.g. a tubular metal bar) or actually a bell. Often used in the plural to refer to the set: the chimes.; n The sound of such an instrument or device.

## Scientific Use

- Prioritize roots marked `inspect`, not merely frequent roots.
- Single-letter and two-letter roots require extra internal evidence from the manuscript.
- External etymology can suggest meanings; it cannot decide boundaries alone.
- A semantic translation must reuse the same root meanings consistently across units.
- If every token can be explained by many unrelated languages, the hypothesis weakens.
