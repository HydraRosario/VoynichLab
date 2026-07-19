# VoynichLab Etymology Metasearch

- dataset: manual token
- providers: wiktionary, wikipedia, datamuse
- cache: translator/cache/etymology

This is a candidate generator, not a proof. It gathers external lexical evidence and marks noisy roots instead of pretending every hit is meaningful.

## Ranked Roots

### hate

- paragraph count: 1
- levels: manual
- examples: manual
- confidence: 11.56
- status: inspect
- wiktionary languages: 9
- explicit etymology: yes

#### Wiktionary
- English | etymology yes
  - etymology: From , , , probably from and/or . Merged with , , from , from , from , from . Cognate with , , , , , , , , , ; also , , , , , . The verb is from , , , , , , , , , from , from , from , from , from the same root as above. Cognate with , , , , , , , , , , , , .
  - def: An object of hatred.
  - def: Hatred.
  - def: To dislike intensely or greatly.
- Bola | etymology yes
  - etymology: .
  - def: liver
- Cia-Cia | etymology yes
  - etymology: From Proto-Celebic *qate, from , from .
  - def: liver
- Middle English | etymology yes
  - etymology: Most likely a modification of earlier (from ) after , though compare .
  - def: , hatred, anger, wroth.
  - def: Something that causes or induces hate; insults, demeaning words.
  - def: The results of hate; enmity, discord, turmoil.
- Norwegian Bokmål | etymology yes
  - etymology: From .
  - def: to (somebody / something)
- Norwegian Nynorsk | etymology yes
  - etymology: From .
  - def: to (someone, something)

#### Wikipedia
- Hate (disambiguation): Hate is an emotion of intense revulsion.
- Hatred: Hatred or hate is an intense negative emotional response towards certain people, things or ideas, usually related to opposition or revulsion toward something. Hatred is often associated with intense feelings of anger, contempt, and disgust. Hatred is seen as the opposite of love.
- Hate That I Made You Love Me: "Hate That I Made You Love Me" is a song by American singer-songwriter Ariana Grande, serving as the lead single from her upcoming eighth studio album, Petal (2026). It was released on May 29, 2026, through her own imprint label, Babydoll Music, under exclusive license to Republic Records. Written and produced by Grande, Ilya Salmanzadeh, and Max Martin, it is a pop, alt-pop, R&B, synth-pop, and downtempo song with trap elements.

#### Datamuse
- hate: v (transitive) To dislike intensely or greatly.; v (intransitive) To experience a feeling of hatred.

## Scientific Use

- Prioritize roots marked `inspect`, not merely frequent roots.
- Single-letter and two-letter roots require extra internal evidence from the manuscript.
- External etymology can suggest meanings; it cannot decide boundaries alone.
- A semantic translation must reuse the same root meanings consistently across units.
- If every token can be explained by many unrelated languages, the hypothesis weakens.
