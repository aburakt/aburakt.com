---
title: "Automating macOS System Data Cleanup"
description: "How the cleanup-macos-sysdata script keeps my development machine lean without risky manual steps."
date: "2024-09-17"
---

On the eve of launching this portfolio refresh I ran out of storage — again. To stop babysitting Finder, I wrote the [cleanup-macos-sysdata](https://github.com/aburakt/cleanup-macos-sysdata) script, which sweeps Xcode caches, derived data, and orphaned Time Machine snapshots while logging every action for review.

It leans on familiar shell tooling but adds dry-run mode, confirmation prompts, and simple reporting so I can reclaim space with confidence before big builds or recording demos. Keeping my development machine tidy now takes minutes instead of hours.
