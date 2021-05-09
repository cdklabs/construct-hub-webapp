# Construct Hub Web Application Analytics

The construct hub web application is designed to help users find and interact with construct libraries.

In order for its operators to understand whether it indeed serves its purpose, the application offers an analytics
mechanism to extract insights from the traffic it sees.

This document describes that mechanism, detailing how, why, and what can be recorded.

## Recorded Data

To understand which data should be recorded, we introduce a few questions we'd like to ask.
For each question, we explain why are we asking it, and which measurements are needed in order to answer it.

### Are users satisfied with the hub?

We need to make sure users are happy with the overall experience of the hub.
To answer this, we need to understand whether existing users are abandoning the hub, or keep using it.

Since we don't identify individual users, the only thing we can do is measure total hub visits, and make sure this value doesn't decrease over time.

**Required metrics:**

- `visits.hub`: Number of distinct visits. (main page + package pages)

### Are people aware of the hub?

The construct hub should serve as many users as possible, which means making sure it is constantly being exposed to new people.
Since we don't attribute traffic to any specific user, the only thing we can do is look at overall visits over time, and ensure that
it keeps increasing.

**Required metrics:**

- `visits.hub`: Number of distinct visits. (main page + package pages)

### Are users satisfied with the search experience?

Search is one of the core capabilities the hub offers. A poor search experience will likely cause users to discover less construct libraries,
and will hurt the ecosystem. To answer this question, we first need to define what a good experience is.

Effectiveness of search engines is measured by the engagement of users with the search results.
In our case, a successful engagement will result in the installation of a construct library.

Since package installation doesn't happen via the hub, this is impossible to deterministically detect.
Nevertheless, we approximate by making the following assertions:

- A user who clicked on the *Copy installation instructions* button, installed the package.
- A user who spent more than X time on the package page following a search, installed the package.

Tracking individual requests is not sufficient to detect these interactions. For example, a user who directly visits a package page should not be counted.
This means we need to track user sessions as a whole. Specifically, we want to detect the following user journey:

*search* --> *select* --> *install*

If we see that most search journeys terminate at the *install* phase, we conclude users are finding what they're looking.

**Required metrics:**

- `journeys.search.success`: Number of journeys that start with a search query, and end in an install.

### Are users satisfied with the package pages?

Continuous operation of construct libraries requires a reliable and clear source of documentation. This is offered by the specific package pages of the hub.
An insufficient page will result in a poor experience as users develop against the construct library, and will cause general frustration.

To know if users are satisfied, we look at the engagement they have with the package pages.
Since package pages involve mainly viewing at the page, we define a positive experience as:

- A user who spent more than X time on the package page following a direct visit, found it useful.

Tracking individual requests is not sufficient to detect this interactions since we want to exclude users who stumbled upon a package page
during a search journey. Specifically, we want to detect the following user journey:

*package-page* --> *stay*

If we see that most of these journeys are successful, we conclude users are satisfied with it.

**Required metrics:**

- `journeys.operate.success`: Number of journeys that start with a direct package page, and end in a successful interaction.

### Are people aware of package pages?

As already mentioned, we want package pages to be the go to place for users operating construct libraries.
For that to happen, package pages should be exposed to as many people as possible.

To ensure this, we look at the direct visits to package pages, and make sure its value is increasing over time.

**Required metrics:**

- `visits.packages.<package>`: Number of distinct visits to specific package pages.

### Which constructs are missing from the ecosystem?

By detecting missing constructs, we can either explicitly act, or encourage the community to act in order to fill those gaps.

To answer this, we want to identify hot search items that don't return any hits. For example, if we see `docker-compose` is being searched a lot,
we can conclude that the community is looking for a `docker-compose` CDK. This can help detect entirely new domains that aren't being covered but should,
as these will likely not manifest as feature requests in any of the existing CDKs.

**Required metrics:**

- `search.terms.<term>`: Number of search queries for `term`.

## High Level Design

TBD