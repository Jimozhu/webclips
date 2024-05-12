---
title: "Avoid Spaghetti Code with Scope Minimization"
date: 2022-09-30T09:22:28+08:00
draft: false
categories: [dev]
tags: [dev]
---
> 原文地址 [massimo-nazaria.github.io](https://massimo-nazaria.github.io/blog/2022/02/10/avoid-spaghetti-code-with-scope-minimization.html)

Let’s see some recommendations on how to prevent the phenomenon of [_spaghetti code_](https://en.wikipedia.org/wiki/Spaghetti_code) just by minimizing the visibility of variables.

Our aim will be reducing to the minimum possible the portion of code where our variables are visible over the source code, namely reducing the [_scope of variables_](https://en.wikipedia.org/wiki/Variable_(computer_science)#Scope_and_extent).

Scope minimization is the process of structuring code in such a way that it’s easy to:

- declare variables that have minimal scope, and
- assign variables with data that have minimal scope.

As a matter of fact, it’s the code structure that defines the visibility of variables.

## Background Notions

A program is made of a combination of _statements_ that are either [_simple_](https://en.wikipedia.org/wiki/Statement_(computer_science)#Simple_statements) (e.g. assignments) or [_compound_](https://en.wikipedia.org/wiki/Statement_(computer_science)#Compound_statements) (e.g. conditionals, loops).

The latter kind of statements can be [_nested_](https://en.wikipedia.org/wiki/Nesting_(computing)), which means they can be made of [_code blocks_](https://en.wikipedia.org/wiki/Block_(programming)) that can contain other statements.

In particular, let’s consider two blocks _A_ and _B_:

- we say _A_ is the _outer block_ of _B_ if _A_ contains _B_, while
- we say _B_ is the _inner block_ of _A_ if _B_ is contained by _A_.

The _indentation level_ of a block is the number of its nesting levels, and corresponds to one level higher than its outer block.

Let’s define the _global scope_ as special block having no outer blocks and indentation level 0.

Finally, global variables are those defined in the global scope.

## Variable Visibility Rules

A variable is visible in the portion of code that:

1. starts from the variable’s declaration statement,
2. ends at the end of the variable’s declaration block, and
3. includes _all_ the nested blocks within 1. and 2.

Complementary, a variable is not visible in the portion of code that lies:

1. before the variable’s declaration, and
2. after the end of the variable’s declaration block.

## Recommendations

- R1. Never use global variables
- R2. Declare single-purpose variables
- R3. Declare variables close to their use
- R4. Keep code blocks small
- R5. Use variables close to their declaration
- R6. Use no more than two nesting levels

### R1. Never use global variables

Never declare or use global variables as they make code a lot more difficult to read, maintain and test. See [_“global variables are bad”_](https://wiki.c2.com/?GlobalVariablesAreBad).

Their use increases the occurrences of problematic [_side effects_](https://en.wikipedia.org/wiki/Side_effect_(computer_science)), which often lead to programming errors that are not easy to identify and fix.

The fewer the statements over the program that could erroneously assign variables, the better.

In conclusion, the use of global variables often represent [_technical debts_](https://en.wikipedia.org/wiki/Technical_debt), which must be repaid ASAP with a code rewrite!

### R2. Declare single-purpose variables

Declare and use variables for a single specific purpose so as to restrict their scope to the minimum.

The more the purposes of a declared variable, the higher the number of statements the variable will be visible to.

The higher the number of statements the variable is visible to, the more the statements that could erroneously assign the variable.

The more the statements that could erroneously assign the variable, the more difficult to find and fix potential errors.

Summing up: only declare and use variables that are single-purposed.

### R3. Declare variables close to their use

Declare variables as close as possible to the statements and code blocks that will use them.

Strictly related to the recommendation R2, this is another way of reducing the number of statements that can use the declared variables.

#### Example: Three Subsequent Blocks

First, let’s consider three subsequent code blocks _A_, _B_, and _C_, namely:

- _A_, _B_, and _C_ are in the same outer block, and
- they have the same level of indent.

Second, let’s declare a variable _v_ immediately before _A_, at the same indentation level of _A_.

According to the visibility rules, _v_ will be visible to all the three subsequent blocks _A_, _B_, and _C_.

Now let’s assume we need _v_ to be visible only to _C_.

Clearly, declaring _v_ immediately before _C_ will reduce its visibility by making it only visible by statements within _C_. So far so good!

However, this recommendation is only partially useful, if followed without the next recommendation being followed as well.

### R4. Keep code blocks small

Similar to the recommendation R2 on single-purpose variables, keep code blocks as small as possible by making them focused on a single specific task.

Otherwise, some variables will likely become unnecessarily visible by the code block parts dedicated to different tasks.

Let’s take again the three subsequent blocks _A_, _B_ and _C_ introduced before, which have the same indentation level.

Let’s suppose we need to declare a variable _w_ to be used and modified by _A_ while only being read by B and C.

Declaring _w_ immediately before A is inevitable, thus its scope will unnecessarily include _B_ and _C_.

This makes _B_ and _C_ able to also assign _w_, while want them to only be able to read _w_’s value.

How do we avoid this? Just separate _B_ and _C_ into two distinct functions, that take _w_ as one their arguments.

Summing up: make code blocks being single-task, and move sub-tasks into separate functions.

### R5. Use variables close to their declaration

Remember to use variables as close to their declaration as possible.

Let’s say you need to use (i.e. either read or assign) a variable _v_ declared in an outer block.

Remember to minimize the indentation levels between the statement that uses _v_ and the declaration block of _v_.

A general rule: _Two_ should be the maximum number of nesting levels between the variable declaration and its use.

For completeness, let’s see an example where it may be reasonable to use variables at a distance of _three_ nesting levels (i.e. one more than the recommended).

#### Example: Matrix Multiplication Algorithm

Let’s consider the iterative [matrix multiplication algorithm](https://en.wikipedia.org/wiki/Matrix_multiplication_algorithm#Iterative_algorithm), which uses three nested loops.

The deepest of such loops contains this assignment statement:

> ![](https://simpleread.oss-cn-guangzhou.aliyuncs.com/sr_d1ukg8b67w15oot8/e0f3fd73.png)

_A_ and _B_ used by the statement are declared in an outer block at three nesting levels of distance, which is one level more than the recommended maximum.

In cases like this, it’s very much forgivable to make an exception to the rule.

Corner-cases apart, consider _three_ as too many levels of indent when using variables declared in outer blocks.

Despite can be practically met by recommendation R6, keeping this recommendation in mind it’s always a good idea when organizing code.

### R6. Use no more than two nesting levels

In general, remember to reduce the depth of nested blocks as much as possible.

The maximum nesting depth in each function should be _two_ at most.

When a function has a nesting depth higher than two, restructure it in the following way:

1. move some sub-blocks into separate functions, and
2. pass the variables used by the moved sub-blocks as functions’ arguments.

As seen in the recommendation R5, it’s sometimes reasonable to have _three_ as the maximum depth.

Again, corner-cases apart, always consider _two_ as the maximum nesting depth.

- [Software Architecture Design Fundamentals for Busy Developers](https://massimo-nazaria.github.io/blog/2019/09/05/software-architecture-design-for-busy-developers.html)
- [Mind the Architecture-Code Gap](https://massimo-nazaria.github.io/blog/2019/03/13/mind-the-architecture-code-gap.html)
- [Testability = Modularity](https://massimo-nazaria.github.io/blog/2020/01/15/testability-equals-modularity.html)
