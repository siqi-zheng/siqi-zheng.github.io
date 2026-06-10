---
slug: "rb-inference-1"
title: "Introducing Hypothesis Testing in Relative Belief Framework"
date: "2026-06-04"
summary: "Measuring statistical evidence using relative belief ratio, and the strength of evidence using posterior content."
tags: ["Probability Theory","Relative Belief"]
featured: false
---


## The Core Analogy: Counting Experiments

In High Energy Physics (HEP), you often measure a count $t$ (e.g., observed events) and ask: is there a signal, or is it just background? The signal strength is $\lambda$, and the null hypothesis is $H_0: \lambda = \lambda_0$ (background-only). The **Relative Belief Ratio** (RB) is the Bayesian analogue of a likelihood ratio — it answers: *"Did the data update our belief in $\lambda_0$ upward or downward?"*

$$
\text{RB}(\lambda_0 \mid t) = \frac{\text{posterior density at } \lambda_0}{\text{prior density at } \lambda_0}
$$

- **RB > 1**: The data *increased* our belief that $\lambda = \lambda_0$. Evidence **in favor**.
- **RB < 1**: The data *decreased* our belief that $\lambda = \lambda_0$. Evidence **against**.

It's essentially asking whether the observed data makes the background-only hypothesis more or less credible than before seeing the data.

## What is Strength $S(t)$?

$$
S(t) = \Pi\bigl(\text{RB}(\lambda \mid t) \leq \text{RB}(\lambda_0 \mid t)\bigr)
$$

Think of the full posterior as a **landscape of plausibility** over all possible signal strengths $\lambda$. The RB at each $\lambda$ tells you how much the data boosted or suppressed belief there. **Strength is the posterior probability mass assigned to all values of $\lambda$ that are *no more supported by the data* than $\lambda_0$ is.**

In other words: of all the $\lambda$ values the posterior considers, what fraction are even *less* data-consistent than your null value $\lambda_0$?

## The Asymmetric Logic 

In hypothesis testing, we have three possibilities:

Evidence in favor of $H_0: \lambda = \lambda_0$ if $\text{RB}(\lambda_0 \mid t) > 1$

Evidence against $H_0: \lambda = \lambda_0$ if $\text{RB}(\lambda_0 \mid t) < 1$

Neither in favor or against $H_0: \lambda = \lambda_0$ if $\text{RB}(\lambda_0 \mid t) = 1$

When there is evidence against the value $\lambda_0$, then a __small__ value of strength indicates a large belief that the true value of $\lambda$ is in the set $\{\lambda : \text{RB}(\lambda \mid t) \leq \text{RB}(\lambda_0 \mid t)\}$ and so there is __strong__ evidence against $\lambda_0$.

When there is evidence in favor of the value $\lambda_0$, then a __small__ value of strength indicates a large belief that the true value of $\lambda$ is in the set $\{\lambda : \text{RB}(\lambda \mid t) \leq \text{RB}(\lambda_0 \mid t)\}$ and so there is __weak__ evidence in favor of $\lambda_0$.

The intepretation of the same $S(t)$ depends on the direction evidence points. Here's why.

### Case 1: Evidence Against $H_0$ (RB < 1, e.g., you see a signal excess)

The data already disfavors $\lambda = \lambda_0$. Now ask: **how badly** disfavored is it?

- A **small** $S(t)$ means most of the posterior mass sits on values $\lambda > 0$ that are *even better supported* than $\lambda = \lambda_0$. Almost the entire posterior landscape towers above $\lambda_0$'s RB value. The null sits in the basement of plausibility. → **Strong evidence against $H_0$.**
- A **large** $S(t)$ means many other $\lambda$ values are also poorly supported — $\lambda_0$ is disfavored, but not uniquely so. → **Weak evidence against $H_0$.**

Imagine you're running a search for the Higgs boson. You observe a sharp excess of events at 125 GeV. The background-only hypothesis $\lambda = \lambda_0$ has RB < 1 — the data already disfavors it. But *how badly* disfavored?

Look at the full posterior landscape over all signal strengths $\lambda$. The vast majority of that landscape — say, all values near $\hat\lambda \approx 1$ — has a *much higher* RB than $\lambda = \lambda_0$ does. The null hypothesis sits at the very bottom of the plausibility ranking. $S(t)$ is the posterior mass assigned to values *at or below* $\lambda_0$'s rank — and since almost nothing ranks that low, $S(t)$ is tiny.

Then $S(t) \approx 0.001$ would mean only 0.1% of the posterior considers values of $\lambda$ *as poorly supported* as the background-only hypothesis. The posterior is unambiguously concentrated far away from $\lambda = \lambda_0$. This is analogous to a 5-sigma excess — not only does the data disfavor background-only, but the *entire probability mass* has migrated toward the signal region. **Small $S(t)$ when RB < 1 is your Bayesian analogue of a large significance: the null isn't just wrong, it's comprehensively isolated at the bottom of the plausibility landscape.**

Suppose you see a mild 2-sigma fluctuation. RB < 1 still, but now many other $\lambda$ values also have low RB — the posterior is spread out and uncertain. A large fraction of the posterior mass sits on values that are *also* poorly supported, so $S(t)$ is not particularly small. The null is disfavored, but it has plenty of company — that's weak evidence.

### Case 2: Evidence In Favor of $H_0$ (RB > 1, e.g., you see no excess)

The data boosted belief in $\lambda = \lambda_0$. Now ask: **how convincingly** is it favored?

The strength
$$
S(t) = \Pi\bigl(\text{RB}(\lambda\mid t) \leq \text{RB}(\lambda_0\mid t)\bigr)
$$
tells you **how well $\lambda_0$ compares to other possible values** in terms of data support.
  
A small $S(t)$ means that only a small fraction of the posterior mass lies on values with RB no larger than $\text{RB}(\lambda_0\mid t)$. Equivalently, *most* of the posterior mass is on values $\lambda$ with **higher** RB than $\lambda_0$. So although $\text{RB}(\lambda_0\mid t) > 1$ says the data nudge you toward $H_0$, the *global picture* is that many other values are even better supported by the data than $\lambda_0$. The null benefits somewhat from the data, but so do many other values. Since it is not among the best-supported explanations, we conclude **evidence in favor exists, but it is weak.**

A large $S(t)$ means that a large fraction of the posterior mass lies on values with RB no larger than $\text{RB}(\lambda_0\mid t)$. That is, very little posterior mass achieves a higher RB than $\lambda_0$; the null is at or near the top of the evidence landscape. Combined with $\text{RB}(\lambda_0\mid t) > 1$, this means the data both boost belief in $\lambda_0$ and make it one of the most data-supported values overall. Therefore, we have **strong evidence in favor of $H_0$.**

Suppose you set an exclusion limit. If $S(t)$ is large when RB > 1 for $\lambda = \lambda_0$, it means background-only genuinely sits near the top of the posterior plausibility ranking — solid support for null. A small $S(t)$ even when RB > 1 warns you: the data preferred null, but the posterior is actually peaking somewhere else, so don't over-claim exclusion.

## The Unified Rule

| Situation | $S(t)$ small | $S(t)$ large |
| :-- | :-- | :-- |
| RB < 1 (against $H_0$) | **Strong** evidence against | Weak evidence against |
| RB > 1 (in favor of $H_0$) | **Weak** evidence in favor | Strong evidence in favor |

The key asymmetry is that $S(t)$ always measures *where $\lambda_0$ sits in the posterior ranking*. When you're already against $H_0$, being ranked near the bottom (small $S$) is damning. When you're already in favor of $H_0$, being ranked near the bottom (small $S$) means the posterior mass is elsewhere — your "favor" is accidental, not convincing. 

## Prosecutor’s Fallacy: Against Bayes Factor
Let $N$ be a very large population. A crime is committed by someone who is known to possess a rare trait, $X$. Let $p$ be the probability that a random person has trait $X$, where $p$ is very small.

Suppose a suspect is randomly pulled from the population and found to have trait $X$. We want to evaluate the hypothesis $H_0$ that this suspect is guilty.

1. **Prior Probability:** Since the suspect is drawn from a huge population $N$, the prior probability of guilt is extremely small:
$$P(H_0) = \frac{1}{N}$$
2. **Likelihoods:** If the suspect is guilty, they definitely have the trait. If they are innocent ($\neg H_0$), the probability they happen to have the trait is $p$.

$$P(X | H_0) = 1 \quad \text{and} \quad P(X | \neg H_0) = p$$

### The Bayes Factor and Relative Belief
When we observe that the suspect has trait $X$, we compute the Bayes Factor ($BF$) and Relative Belief ratio ($RB$):

- **Bayes Factor:** Measures the ratio of the likelihoods. 
$$BF(H_0) = \frac{P(X | H_0)}{P(X | \neg H_0)} = \frac{1}{p}$$
- **Relative Belief Ratio:** Measures the ratio of the posterior probability to the prior probability. The posterior probability $P(H_0 | X)$ is:

$$P(H_0 | X) = \frac{P(X | H_0)P(H_0)}{P(X | H_0)P(H_0) + P(X | \neg H_0)P(\neg H_0)} \approx \frac{1/N}{1/N + p} \approx \frac{1}{pN}$$

The Relative Belief ratio is therefore:

$$RB(H_0) = \frac{P(H_0 | X)}{P(H_0)} \approx \frac{1/(pN)}{1/N} = \frac{1}{p}$$

Because $p$ is very small, both $BF(H_0)$ and $RB(H_0)$ are astronomically large. In traditional interpretations of Bayes Factors (like the Jeffreys scale), a massive $BF$ is treated as "decisive evidence" that $H_0$ is true.

### The Paradox and Its Resolution
The paradox arises because declaring the suspect guilty based on a large Bayes factor is mathematically flawed. If $N = 1,000,000$ and $p = 1/10,000$, there are still $pN = 100$ people in the population with this rare trait. The suspect is just one of 100 potential matches.

Michael Evans resolves this in the **Relative Belief framework** by strictly separating two concepts: 
1. **Measure of Evidence ($RB$):** Tells you *if* your belief should increase. Here, $RB \approx 10,000$. The evidence strongly points toward guilt because your belief in the suspect's guilt increased by a factor of 10,000.
2. **Strength of Evidence:** Evaluates if the evidence is actually strong by calculating the posterior probability of the hypothesis. Here, the strengtength is $P(H_0 | X) \approx \frac{1}{pN} = \frac{1}{100} = 0.01$.

## Conclusion 
The evidence in favor of guilt is large because finding the trait is highly anomalous for an innocent person, but the *strength* of that evidence is extraordinarily weak (1%) because the initial prior was so small. Using the Bayes Factor alone without assessing the posterior strength causes the Prosecutor's Fallacy; the Relative Belief framework forces the researcher to compute the strength metric, which correctly identifies the evidence as too weak to convict. 

> Strength is essentially a **posterior p-value** or **credible rank** for $\lambda_0$, and its interpretation flips depending on which direction the evidence points.
