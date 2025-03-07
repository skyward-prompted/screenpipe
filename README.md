<!-- Skyprompt Title and Subtitle -->
<p align="center" style="font-family: 'Press Start 2P', monospace;">
   <h1 align="center">[ skyprompt ]</h1>
   <p align="center">AI app store powered by 24/7 desktop history</p>
   <p align="center">open source | 100% local | dev friendly | 24/7 screen, mic recording</p>
</p>


# how it works?

- we record everything 24/7, 100% locally, uses 10% CPU, 4 GB ram, 15 gb/m
- we index it into an api
- dev build ai apps w user's full context, desktop native, nextjs, publish, monetize

<img src="./content/diagram2.png" width="800" />

<img src="https://github.com/user-attachments/assets/da5b8583-550f-4a1f-b211-058e7869bc91" width="400" />



# why?

- ai models are commoditized 
- ai is as good as its context
- the most valuable context is all contained in your screen


## get started

macos, linux:

```bash
curl -fsSL get.screenpi.pe/cli | sh
```

or on windows

```bash
iwr get.screenpi.pe/cli.ps1 | iex
```

then

```bash
skyprompt
```

make sure to allow permissions on macos (screen, mic)

## create plugins

```bash
bunx --bun @skyprompt/dev@latest pipe create
```

skyprompt has a plugin system called "pipe" which lets you create desktop app in nextjs in a sandboxed environment within our Rust code, [read more](https://docs.screenpi.pe/docs/plugins)

you can then publish these to our store and make money:

```bash
cd foo
bunx --bun @skyprompt/dev@latest pipe register --name foo [--paid --price 50] # subscription
bun run build
bunx --bun @skyprompt/dev@latest pipe publish --name foo
```


