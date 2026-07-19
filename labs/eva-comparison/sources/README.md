# EVA Sources

## IT2a-n.txt

Downloaded from:

```text
https://www.voynich.nu/data/IT2a-n.txt
```

This is the `IT` transliteration listed by Rene Zandbergen: the Takeshi
Takahashi transliteration included in the Landini-Stolfi interlinear file,
converted to IVTFF 2.0.

The source page is:

```text
https://www.voynich.nu/transcr.html
```

Relevant notes from the source page:

- IVTFF files are intended for machine analysis.
- `IT` is an older Takahashi EVA transliteration included in LSI.
- It is provided in a standardized IVTFF 2.0 text format.

For f1r extraction:

```powershell
npm.cmd run extract:ivtff -- --source sources/IT2a-n.txt --page f1r --paragraphs 2 --out-dir cases/f1r
```
