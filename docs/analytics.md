# Construct-Hub Analytics

This document details the analytics capabilities offered by the construct hub web application.

## What to track

### Traffic Volume

We want to make sure the hub sees consistent and increasing traffic over time. To the end, we track the following metrics:

### Traffic Quality

We want to make sure users have a productive experience with the hub. Given it is designed to find and operate construct libraries, we define a produtive experience as one of two user journeys:

#### Install

A user visits the main page and winds up installing a construct library. More concretely, this journey has the following stops:

1. **Visit**: User visits the main page of the site.
2. **Search**: User inputs a search term.
3. **Browse**: User browses through the search results.
4. **Navigate**: User navigates to a specific package page.
5. **Install**: User installs the construct library.

    Since package installation doesn't happen via the hub, there is no bulletproof way for us to determine whether a user actually installed a package or not. Nevertheless, we try to approximate by making the following assertions:

    - A user who clicked on the *Copy installation instructions* button, installed the package.
    - A user who spent more than X time on the package page, installed the package.

#### Operate

A user visits a specific package page, and stays there to read documenation.

1. **Visit**: User visits a specific package page.
2. **Operate**: User interacts with the page since it helps to operate the construct.

    User interaction with the package is hard to determine because most of it will probably be looking at documentation. To that end, we make the following assertion:

    - A user who spent more than X time on the package page, used it to operate the construct.

Quality traffic is defined by the success rate of these journeys, we track the following metric:

- `journeys.<journey>.stops.<stop>`

This metric describes the final stop of each journey type.

For example, `journeys.search.stops.browse` counts the number of search journeys that
terminated in the *browse* stop, meaning the user did not click on
any search result.

Given this data, we will be able to extract the following insights:

- Are users finding the libraries the're looking for? why not?

  > If most journeys terminate in the browse/navigate stop, it can either mean our search results aren't good enough, or that the relevant constructs don't exist.

- Do users find the package helpful?

  > If users spend only a few seconds on the package page, it probably means they haven't found what the're looking for.

## High Level Design

TBD