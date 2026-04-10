---
slug: "scaling-jupyterhub-university-60-yoy"
title: "How I Drove 60% YoY User Growth in JupyterHub at University Scale"
date: "2026-04-10"
summary: "A look at the platform engineering and SRE strategies used to scale JupyterHub and how these principles apply to modern MLOps."
tags: ["Platform Engineering", "JupyterHub", "MLOps"]
featured: true
---

Scaling an interactive computing environment for a diverse university population is no small feat. In the past 3 years, I helped drive a massive **60% year-over-year user growth** in our JupyterHub deployment. To pull this off without the system crumbling under pressure, I applied a **Platform Engineering and Site Reliability Engineering (SRE)** model. Here is exactly how treating our infrastructure like a tier-one product drove unprecedented adoption.

### Proactive System Observability
User trust plummets when systems crash silently. To keep things stable, we overhauled our observability practices by integrating default **Microsoft Cloud** tools with **Grafana** with 2i2c to create highly visible, real-time dashboards. This setup triggered *immediate alerts* the second a disk got full or a node failed. By pairing these automated alerts with weekly syncs alongside the backend team, we completely shifted from a reactive firefighting mode to proactive system maintenance. 

### The One-Stop Shop Experience
Complexity is the ultimate enemy of adoption. Previously, students and researchers had to navigate a maze of fragmented portals just to find their preferred data science environments. We fixed this by unifying **RStudio, JupyterHub, and JupyterLab onto** [a single, intuitive landing page](https://datatools.utoronto.ca/). This frictionless front-end meant users could launch their required workspaces in just one click, completely shielding them from the underlying infrastructure.

### Bridging Devs and HPC Users
A university houses everyone from first-year Python students to post-docs running massive physics simulations. To support these vastly different workloads, I acted as a bridge between the development team and our end-users. We built **customized solutions for High-Performance Computing (HPC)** needs for Rotman Commerce, ensuring the heavy lifters got the dedicated resources they required without bottlenecking the rest of the system. 

### Streamlined Support Channels
When things break, users need a lifeline. Before our upgrades, users encountering deep technical difficulties often felt like they were shouting into the void. To fix this, we established **mature communication procedures and dedicated support tools**. This created a direct, structured pipeline to the dev team, ensuring complex user issues were escalated and resolved rapidly.

### Predictive Maintenance and Updates
A major roadblock we faced was outdated R and Python kernels, which caused many modern packages and libraries to fail. However, updating a massive live system is risky. To solve this, we used **time-series Prophet models** to analyze usage logs, identifying distinct weekly traffic patterns and off-peak academic seasons. By predicting exactly when system usage would hit rock bottom, we confidently scheduled our kernel updates during these windows, keeping the system up-to-date year-round with zero disruption to end-users.

### Automating Resource Cleanup
Scaling user growth also means you have to aggressively scale your cleanup efforts. To keep the system performant and secure, we implemented **automated user offboarding**. The system now automatically revokes access and reclaims server resources the moment a student or researcher leaves the university. This simple automation prevents resource bloat, saves money, and ensures our infrastructure scales efficiently for active users.

### Transferring Skills to MLOps
The exact SRE and platform engineering principles I used to scale JupyterHub are foundational to building highly scalable Machine Learning systems. Moving from academic infrastructure to enterprise MLOps requires the exact same core competencies:
- Designing unified front-end interfaces to easily deploy and serve machine learning models.
- Establishing rigorous observability with Grafana to track model drift and overall compute health.
- Brokering connections between data scientists and backend engineers to optimize expensive GPU allocation.
- Utilizing time-series forecasting to predict peak inference loads and seamlessly schedule model updates.
- Automating the teardown of stale training pipelines to control runaway cloud costs.

> *Ultimately, whether you are managing a university JupyterHub or a massive ML infrastructure, success comes down to treating your platform as a product and prioritizing both reliability and the end-user experience.*

