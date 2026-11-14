---
title: "My Mac Kept Freezing, So I Taught My Coding Agents to Look"
description: "An iOS Simulator nobody remembered was holding 8.7 GB. Why a skill couldn't have prevented it, and the zero-dependency hooks that now tell every agent what the machine can take."
date: "2026-11-14"
---

My MacBook Air has 16 GB of memory, and lately it kept freezing. The cursor would spin and the fans stayed quiet, because the machine wasn't busy computing. It was swapping.

So I stopped guessing and measured. The load average was 67. Swap was 6.7 of 8 GB full. macOS had killed processes for running out of memory nine times in five days. The biggest single consumer was an iOS Simulator that had been booted the day before and never shut down. It was holding **8.7 GB**, along with 180 background processes for apps I never opened: News widgets, Maps, Health.

I didn't remember booting it. Most likely an AI coding agent had, while checking a change in a React Native app. The other heavy processes in those out-of-memory reports were an Android emulator, a Gradle daemon and a desktop app. None of them were wrong to start. But nobody was watching the total.

## The agent can't see the machine

A coding agent sees your files, your terminal output and your instructions. It doesn't see that memory is at 18%, that a simulator is already running, or that the dev server it's about to start is already listening on port 8081. So it does the reasonable thing for one task and leaves the machine worse off. Then it does it again.

My first fix was the obvious one: I wrote rules into my agent instructions. One device at a time. Stop what you start. Check memory before a build. That helps, but only while the agent remembers the rules. And remembering is exactly what fails halfway through a long session.

## Why a skill wasn't enough

Agent skills are great for knowledge, but an agent loads one only when it decides the skill is relevant. "Your machine is about to fall over" is not something it can decide, because it can't see the machine.

What it needed was something that runs every time, whether the agent thinks of it or not. Every major coding agent now has that: **hooks**. Claude Code, Codex, Cursor, Gemini CLI and Copilot CLI can all run a command when a session starts and before a shell command. That command can add a line to the agent's context, or block the shell command with a reason.

## redline

So I built [redline](https://github.com/aburakt/redline). At session start, the agent gets one line:

```text
redline: mem 18% free (WARN) · swap 6.7G · disk 18G free · heavy: ios-sim 8.7G, android-emu 3.1G, gradle 1.4G · ports 8081
```

If it then tries to boot Android on top of that, it gets advice before the command runs:

```text
redline: memory warn, 18% free; top: ios-sim 8.7G (free: xcrun simctl shutdown all).
Only one device at a time; stop it when done (adb emu kill). | iOS simulator is running: shut it down before starting Android.
```

When memory is critical, the build is stopped with the same kind of explanation. Commands that would hang the agent forever, like watch mode, `vim` or `git rebase -i`, get a nudge toward the run-once form even when the machine is idle.

Four decisions shaped the rest:

- **Silent when fine.** Context is the agent's scarcest resource. If nothing is wrong, the hook prints nothing.
- **Never kill anything.** redline informs and, at worst, stops the agent's *next* command. Shutting the simulator down is still the agent's or my decision.
- **Zero dependencies.** It's one POSIX `sh` script and one PowerShell script. A hook that runs before every shell command has to be something you can read in five minutes and trust. I didn't want users to need Node, Python, Bun or a 60 MB binary.
- **Fail open.** If redline breaks, the hook exits quietly. A safety tool must never be the thing that blocks you.

The same test suite runs against both scripts on macOS, Linux and Windows CI, so they have to produce the same output. That's how I found the PowerShell problems a Mac would never have shown me. A background refresh was holding the agent's output pipe open, so every call waited three seconds. A `New-Object` call and a console-encoding switch cost about 200 ms before the script did any real work. Windows is still the slow one: about half a second per hook call, most of it PowerShell starting up. It's a number I'd rather publish than hide.

## What I'd tell my past self

The freezes weren't a hardware problem, and they weren't really the agent's fault either. A tool that starts heavy things needs to see what is already running. Once the agent can see it, it mostly makes good choices on its own. It reuses the booted simulator, asks before a build, and shuts things down when it's finished.

redline is MIT-licensed and installs in a minute: [github.com/aburakt/redline](https://github.com/aburakt/redline). If your agent runs on a machine you also have to work on, give it the one line it's missing.
