---
slug: "rmarkus-story"
title: "Building rmarkus: What an R Package Taught Me About ML Systems"
date: "2026-04-10"
summary: "I used statistical reasoning, software design, and scalable automation to validate heterogeneous code outputs without relying on brittle exact matching."
tags: ["R", "MLOps"]
featured: true
---

# Building rmarkus: From Statistical Auto-Grading to Evaluation Infrastructure

Two years ago, I built **rmarkus**, an R package for automated grading of programming assignments, by taking over a fragile legacy codebase and redesigning it into a more extensible evaluation system. 

## Project snapshot

**What I did.** I refactored an inconsistent internal R package used for auto-grading student programming homework and redesigned much of its logic around object-oriented principles so it could support multiple output types, including basic R objects, linear model objects, and ggplot objects.

**What problem I solved.** Exact equality is often the wrong validation rule for user-generated code. Two students can produce functionally equivalent statistical outputs with different variable names, different ordering, or different implementations, so I built evaluation rules based on meaningful invariants with uncertainties rather than surface-level identity. **This is the same task ML system is trying to solve.**

**Why it matters for ML engineering.** This is the same class of problem that appears in model validation, testing pipelines, and ML infrastructure: defining what counts as equivalent behavior, building reliable automated checks, and scaling evaluation when human inspection is too expensive.

## The problem behind the package

The project started with a practical institutional need. Because of privacy constraints, the school used an internal platform for auto-grading students’ programming homework, and we needed an R package that could test submitted R code reliably across courses with large enrollment.

At first glance, this sounds like a standard testing problem, which is why `testthat` was the natural baseline. But grading student code is not the same as unit testing a controlled codebase. In software tests, we often know **exactly what output should look like**. [Unlike traditional software where input validation can catch malformed data, ML systems must handle ambiguity and uncertainty inherent in real-world observations.](https://mlsysbook.ai/book/contents/core/introduction/introduction.html#:~:text=Unlike%20traditional%20software%20where%20input%20validation%20can%20catch%20malformed%20data%2C%20ML%20systems%20must%20handle%20ambiguity%20and%20uncertainty%20inherent%20in%20real%2Dworld%20observations.) In student submissions, the same correct idea can appear in several syntactic forms, and a strict comparison can reject valid work simply because the representation differs.

That distinction pushed the project into a more interesting technical space. The real challenge was not “compare object A to object B.” The challenge was “define equivalence in a way that matches statistical intent.” 

## Refactoring the legacy system

When I joined the project, the original developer had already left after graduation, and the inherited code showed the usual signs of fast prototype development: inconsistent conventions, duplicated logic, weak separation of concerns, and bugs that made extension risky. **My first job was not adding features. It was stabilizing the foundation.**

I approached that refactor as a software architecture problem. Different output types required different validation logic, so I moved away from patching one-off special cases and toward a more object-oriented structure. Conceptually, the system became a dispatcher from object type to evaluation rule:

$$f(\text{object class}) \rightarrow \text{comparison strategy}$$

That sounds simple, but it changed the package from a collection of ad hoc checks into a system with clearer interfaces. Instead of writing one giant comparison routine, I could design type-specific validation behavior for vectors, lists, model objects, and plotting objects.

> In R, one can check the "type" of a variable using `typeof`, `class` & `mode`. Knowing the difference and use the same function consistently require careful design and deep knowledge of R.


This kind of abstraction matters well beyond education tooling. In ML engineering, you rarely evaluate only one kind of artifact. You may need separate logic for tabular predictions, fitted model objects, plots, diagnostics, and metadata. Good infrastructure starts by recognizing that different objects need different notions of correctness.

## Statistical equivalence over exact equality

The most interesting design decision came from comparing linear model outputs. A naive approach would compare coefficients, variable positions, or internal object fields directly. That is brittle. Two submissions may describe the same model while differing in variable order, capitalization, or nonessential internal structure.

Instead, I chose to compare models through AIC, using

$$\mathrm{AIC} = 2k - 2\log L \quad (1)$$

where $k$ is the number of estimated parameters and $L$ is the maximized likelihood. This choice was important for two reasons.

First, **AIC compresses model quality into a single statistic that balances fit and complexity**. It reflects both the number of parameters and the log-likelihood. In practice, that made it a more robust grading target than literal field-by-field comparison.

Second, AIC aligned the grader with the actual learning objective. If a student can navigate the `lm` object structure well enough to derive or access the right quantity, then they are demonstrating the kind of statistical programming fluency the assignment is meant to test. I wanted the grader to reward that fluency rather than reward one rigid implementation path.

More generally, I think of this as an invariant-design problem. Suppose two outputs $o_1$ and $o_2$ differ in representation but are equivalent under some task-relevant mapping $g(\cdot)$. Then the evaluation rule should focus on

$$g(o_1) \approx g(o_2) \quad (2)$$

rather than on $o_1 = o_2$. In this project, $g(\cdot)$ was not always AIC, but the principle stayed the same: compare objects through properties that capture meaning, not through incidental structure.

That mindset transfers directly to ML systems. In many pipelines, exact bitwise equality is neither realistic nor useful. What matters is whether two models preserve the behavior or performance characteristic that the system actually cares about.

## Automating plot validation

The same philosophy shaped how I handled ggplot outputs. Plot grading creates a different kind of validation problem because humans can inspect plots visually, but humans do not scale. We were supporting five courses with roughly 300 students each on average, so any workflow that depended on manual graph inspection would eventually fail operationally.

For ggplot objects, I focused on structural checks rather than rendered-image comparison. Instead of asking whether two graphs were pixel-identical, I asked whether they encoded the same essential information. That meant validating pieces such as aesthetic mappings and graph type.

At a high level, the checker behaved more like this:

$$\text{score} = h(\text{geom type}, \text{mapped variables}, \text{required structure}) \quad (3)$$

rather than comparing screenshots or relying on human review. This was a deliberate engineering tradeoff. Rendered plots can vary for irrelevant reasons, but the underlying graph specification carries the signal we usually care about in grading.

That tradeoff is also familiar in ML engineering. When you design evaluation infrastructure, the question is often not “can I measure everything?” but “what is the minimal set of signals that gives me a reliable decision rule?” Good infrastructure depends on selecting the right observables.

## Designing Stats-Informed ML Systems

The hardest challenges in ML infrastructure rarely stem from writing the code itself. Instead, they arise from defining what it means for a complex, variable output to be "correct." When exact equality breaks down, naive testing pipelines fail. **Building reliable evaluation systems requires treating mathematical reasoning and software architecture as a single discipline rather than separate domains.**

A stats-informed engineering approach means identifying the true invariants of a system—such as relying on AIC rather than brittle syntax—and encoding them into maintainable abstractions. Whether refactoring a legacy R package or designing automated validation for production ML models, the fundamental objective remains the same. You must translate statistical intent into executable, scalable logic that operates reliably when manual review becomes impossible.