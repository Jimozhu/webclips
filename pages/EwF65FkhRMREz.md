---
title: An exploration of vector search
date: 2024-08-09T01:54:27.422Z
categories:
  - webclip
tags:
  - webclip
origin_url: 'https://blog.shalvah.me/posts/an-exploration-of-vector-search'
---

With the AI hype going around, you may have come across the phrase "vector search", "vector database", or "embeddings" lately. Here's an exploration of what that means. I'm not a data scientist, but I was intrigued and decided to dig in.

## Basic Theory

The idea behind vector search is: "What if we could represent the items in our database, as well as the input term, as vectors? We could then find the vectors which are closest to the input." Let's dig into that.

### Vectors

Think of a vector as describing a movement from one point in space to another point. For instance, in the graph below, we can see some vectors in 2D space: a is a vector from (100, 50) to (-50, -50), and b is a vector from (0, 0) to (100, -50).

A lot of the time (and in the rest of this article), we deal with vectors starting from the origin (0, 0), such as b. We can then omit the "from" part, and simply say b is the vector (100, -50).

How do we extend the idea of vectors to non-numerical entities?

### Dimensions

As we've seen, each numerical vector has x and y coordinates (or x, y, z in a 3D system, and so on). x, y, z... are the axes, or *dimensions* of this vector space. Given some non-numerical entities we want to represent as vectors, we need to first decide on the dimensions, and assign a value to each entity for each dimension.

For example, in a dataset of **vehicles**, we could define four dimensions: "number of wheels", "moves on land", "has an engine", and "max occupants". Then we could represent some vehicles as:

| item       | number of wheels | has an engine | moves on land | max occupants |
| ---------- | ---------------- | ------------- | ------------- | ------------- |
| car        | 4                | yes           | yes           | 5             |
| bicycle    | 2                | no            | yes           | 1             |
| tricycle   | 3                | no            | yes           | 1             |
| motorcycle | 2                | yes           | yes           | 2             |
| sailboat   | 0                | no            | no            | 20            |
| ship       | 0                | yes           | no            | 1000          |

So, our car vector would be (4, yes, yes, 5), or numerically, (4, 1, 1, 5) (putting yes = 1, no = 0).

Dimensions are a way for us to (try to) capture the semantic meaning of an entity and represent it by numbers. For this reason, they are subjective. There's no requirement to pick these specific dimensions. We could instead use, "has wings", "uses diesel", "top speed", "average weight", "price", or whatever.

Dimensions are also called *features* or *facets*. They are an extremely important part of vector search (and data science/machine learning in general). We'll see soon how the number and choice of dimensions can affect the search. For now, let's continue with the next foundation of vector search.

### Similarity

With vector search, we want to return items by closeness to the search term. For example, if a user searches for "car", you want to be able to return results which mention "automobile" and "vehicle" as well. Vector search is one way to address that.

Vector searches are also used in recommender systems. For example, recommending similar products, articles, shows, or songs to a customer based on something they already liked. In this case, the input is already part of the dataset.

So the question is how do we determine which are most similar?

We have to start by defining what we mean by similar. Every vector has a magnitude (aka length, or size) and direction. For instance, in this graph, p and a are pointing in the same direction, but are of different lengths. p and b are in exactly opposite directions, but have the same magnitude. And then there's c, a bit shorter than p, and not pointing in the exact direction, but close.

So which is most similar to p?

* If "similar" means pointing in a **similar direction** only, then a is the most similar to p. Next up is c. b is the least similar, since it points exactly opposite to p
* If "similar" means **similar magnitude** only, then b is the most similar to p (since it has the same length) followed by c, and then a.

In vector search, we rarely look at size alone. This is because you can easily get a vector with totally different values in each dimension but the same overall length (for instance, b is the same length as p, but points exactly opposite). Since vectors are often used to describe semantic meaning, looking at length alone will rarely give you what you want. Most measures of similarity either depend only on the direction, or both the direction and size.

### Measures of similarity

Here are four ways vector similarity is often calculated:

* **Euclidean distance**: The direct distance between the "tips" of the two vectors. The Euclidean distance is 0 when the two vectors are the same, and increases as the angle (direction) or magnitude (length) of either increases. So, for a vector, p, we can compute the distances to all other vectors and pick the one with the smallest.
* **Manhattan distance**: This is also the distance between the "tips", but assuming you were only allowed to walk parallel to the axes (left, right, up, down).
* **Dot product**: You get this by multiplying the corresponding dimensions from the vectors, and adding them up (ie px​ax​+py​ay​). This is a useful formula since it uses the dimensions of the two vectors, which means it accounts for both direction and magnitude.
* **Cosine similarity**: This works by finding the cosine of the angle between the two vectors (which means cosine similarity doesn't consider magnitude, just direction). We get this by dividing the dot product by the product of the two lengths, ie cosθ=∣p∣∣a∣p⋅a​.

This graph shows the four measures for p to another vector a. Drag the tips of the vectors to reposition them, and watch how the values change. (Some things to try: putting the vectors at right angles to each other, putting them directly opposite each other, giving them the same magnitudes).

Euclidean distance, in green:

55.900000000000006

Manhattan distance, in blue:

75

Dot product (p⋅a):

17500

cosθ:

0.919

From this, we can see some useful facts about these measures, and how to choose:

The **Euclidean distance** is 0 if the vectors are exactly the same. As the size of one vector or the angle between them changes, it increases indefinitely. This is probably the most straightforward measure (smaller = more similar), and it's quite commonly used. The **Manhattan distance** behaves similarly (0 when equal, then increases).

The **dot product** starts at some number (not 0) when the two vectors are equal. If you keep the sizes of the two equal, and increase the *angle*, the dot product decreases, reaching 0 when the two vectors are at right angles. Keep on increasing the angle, and it decreases until they are directly opposite each other, then increases again until you get back to the start. On the other hand, if you increase the size of a while keeping the angle constant, the dot product just keeps increasing.

This non-uniform distribution makes the dot product trickier to use (there is no maximum value; a smaller dot product could mean less similar or more similar). It's also non-unique; there are multiple different positions for a that will give you the same dot product as when a = p. The dot product typically only makes sense when we can normalize all vectors to have the same length (at which point, it becomes equal to the cosine similarity).

**Cosine similarity** simply looks at the angle between the two vectors (or more accurately, the cosine of the angle). This means that the result is always between 1 and -1, while the dot product can be any number. The cosine is 1 when the vectors are exactly the same; it decreases to 0 when they're at right angles, and then -1 when they're exactly opposite. Such a neat property. Its disadvantage is that it does not consider the magnitudes—the cosine will have the same value for all vectors pointing in a certain direction, regardless of their length. Hence cosine similarity is often only used when all vectors in the dataset are of the same length, or we don't care about their lengths.

A second disadvantage of the cosine is that it's more computationally expensive. To find the dot product, you need to multiply the dimensions for each vector together and add them up. To find the cosine similarity, you have to divide the dot product by the product of the two vectors' magnitudes. This doesn't seem like a big deal, but in a large database, with thousands or millions of vectors, each having hundreds or thousands of dimensions, this takes valuable CPU time. This is why [Elasticsearch recommends using the dot product with all vectors normalized to the same length](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html#dense-vector-params).

So how do you choose which measure to use? In practice, it boils down to knowing your data, and experimenting to see what gives you the best results. I'm no data scientist, but here's what I gleaned from the Internet:

* The Euclidean distance is a "safe" default to use when you don't know much about your data.
* If all vectors have the same length (or can be normalized to do so), cosine similarity/dot product is probably a good choice.
* The Manhattan distance might be a better measure if the vectors have a high number of dimensions ([research paper \[PDF\]](https://bib.dbvis.de/uploadedFiles/155.pdf), [StackExchange](https://datascience.stackexchange.com/questions/20075/when-would-one-use-manhattan-distance-as-opposed-to-euclidean-distance)).

## A basic example

Let's plot our dataset of vehicles. Since my graph can only represent two dimensions, I'll take two dimensions from the table—"number of wheels" and "has an engine". Let's plot our vectors. Note that "number of wheels" is a continuous dimension (values from 0 and up), while "has an engine" is yes or no (0/1). This gives us the following vectors:

car: (4, yes)\
bicycle: (2, no)\
tricycle: (3, no)\
motorcycle: (2, yes)\
sailboat: (0, no)\
ship: (0, yes)

Also, imagine we're searching for a vehicle which has three wheels and also has an engine. That is the vector (3, yes), represented by P on the graph below. You can see that there's no such vehicle in our set, but the "most similar" within our current dimensions is the tricycle according to the Euclidean and Manhattan distances, but the car according to the cosine. You can try dragging the vector P around, and watch how the closest changes. Sometimes all three measures choose different vectors!

Closest by Euclidean distance, in green:

Tricycle (0.5)

Closest by Manhattan distance, in blue:

Tricycle (0.5)

Closest by normalized dot product/cosine:

Car (0.997)

Voila, we have a very basic visual demo of vector search! Let's write this as code.

PS: You'll notice that no/yes on this graph maps to 0.5/1, rather than 0/1. This is partly for visualization reasons (to make it easier to see on the graph), and partly for technical reasons (the cosine calculation tries to divide by the vector's magnitude, which is impossible if the vector is 0). This is why you generally avoid having zero vectors in your dataset.

## Implementing

Maths refresher: Here are the formulae we're implementing to compute the similarity of two vectors a(ax​,ay​) and b(bx​,by​) (click to expand)

**Euclidean distance** (∣∣a−b∣∣2​): Pair the corresponding dimensions of each vector together, find their difference, and square it. Then add everything together and take the square root. For 2D vectors, this is (ax​−bx​)2+(ay​−by​)2​, but in general, Σ(ai​−bi​)2​.

**Manhattan distance** (∣∣a−b∣∣1​): Pair the corresponding dimensions of each vector together, find their difference, and take its absolute value (change negatives to positives). Then add everything together. For 2D vectors, this is ∣ax​−bx​∣+∣ay​−by​∣, but in general, Σ∣ai​−bi​∣.

**Dot product** (a⋅b): Pair the corresponding dimensions of each vector together and multiply them, then add everything together. For 2D vectors, this is ax​bx​+ay​by​, but in general, Σai​bi​.

**Cosine** (cosθ): Find the magnitude of the two vectors, multiply them together, and divide the dot product by that. In maths notation, this is ∣a∣∣b∣a⋅b​. For 2D vectors, the magnitude is ax2​+ay2​​.

Here's a basic vector db in Ruby:

```
class VectorDb
  attr_reader :vectors

  def initialize
    @vectors = {}
  end

  def add(**new_vectors)
    vectors.merge!(new_vectors)
  end

  def find_similar(vector, measure: :cosine, results: 3)
    vectors_with_distances =
      vectors.map do |other_vector_name, other_vector_dimensions|
        # The search vector may have some dimensions missing,
        # so we remove those from all vectors so that they don't factor into the search
        normalized_search_vector = search_vector.reject { |d| d.nil? }
        normalized_other_vector =
          other_vector_dimensions.reject.with_index { |b_i, i| search_vector[i].nil? }
        [other_vector_name, distance(normalized_search_vector, normalized_other_vector, measure)]
      end
      
    if measure == :cosine
      vectors_with_distances.max_by(results) { |name, distance| distance }.to_h
    else
      vectors_with_distances.min_by(results) { |name, distance| distance }.to_h
    end
  end

  private

  def distance(vector, other_vector, measure)
    __send__(measure, vector, other_vector)
  end

  def euclidean(vec_a, vec_b)
    Math.sqrt(
      vec_a.zip(vec_b).map { |(a_i, b_i)| (a_i - b_i) ** 2 }.sum
    )
  end

  def manhattan(vec_a, vec_b)
    vec_a.zip(vec_b).map { |(a_i, b_i)| (a_i - b_i).abs }.sum
  end

  def dot_product(vec_a, vec_b)
    vec_a.zip(vec_b).map { |(a_i, b_i)| a_i * b_i }.sum
  end

  def cosine(vec_a, vec_b)
    dot_product(vec_a, vec_b) / (magnitude(vec_a) * magnitude(vec_b))
  end

  def magnitude(vec)
    Math.sqrt(vec.map { |v_i| v_i ** 2 }.sum)
  end
end
```

Let's test this vector database with the example of p and a above:

```
db = VectorDb.new
db.add(a: [50, 125])

p = [100, 100]
p db.find_similar(p, measure: :euclidean)
p db.find_similar(p, measure: :manhattan)
p db.find_similar(p, measure: :cosine)
```

This gives:

```
{:a => 55.90169943749474}
{:a => distance=>75}
{:a => distance=>0.9191450300180579}
```

This implementation is *super* basic. The vectors are stored as a simple list, and we search through all the vectors to compute the scores for the chosen measure. This would be unbearably slow in a real-world application.

Let's bring our example dataset of vehicles to use with this vector database, still using the same two dimensions.

```
db = VectorDb.new
# Dimensions used are:
# - number of wheels: (0, ...)
# - has engine: (0.5, 1)
vehicles = {
  car: [4, 1],
  bicycle: [2, 0.5],
  tricycle: [3, 0.5],
  motorcycle: [2, 1],
  sailboat: [0, 0.5],
  ship: [0, 1],
}
db.add(**vehicles)

p = [3, 1]
puts "Euclidean (smaller is better):"
puts db.find_similar(p, measure: :euclidean)
puts "Manhattan (smaller is better):"
puts db.find_similar(p, measure: :manhattan)
puts "Cosine (bigger is better):"
puts db.find_similar(p, measure: :cosine)
```

```
Euclidean (smaller is better):
{:tricycle=>0.5, :motorcycle=>1.0, :car=>1.0}
Manhattan (smaller is better):
{:tricycle=>0.5, :motorcycle=>1, :car=>1}
Cosine (bigger is better):
{:bicycle=>0.9970544855015815, :car=>0.9970544855015815, :motorcycle=>0.9899494936611664}
```

This matches our results from the graph.

### Choosing scales

In the earlier graph, I explained why we used 0.5/1 on our Boolean scale. But why not 1/2, 15/30, or some other scale? Well, we could, too. The graph would look slightly different, but how would our search results change? Let's compute in code:

```
puts 'With 1/2:'
db = VectorDb.new
db.add(
  car: [4, 2],
  bicycle: [2, 1],
  tricycle: [3, 1],
  motorcycle: [2, 2],
  sailboat: [0, 1],
  ship: [0, 2],
)

p = [3, 2]
# ...

puts 'With 15/30:'
db = VectorDb.new
db.add(
  car: [4, 30],
  bicycle: [2, 15],
  tricycle: [3, 15],
  motorcycle: [2, 30],
  sailboat: [0, 15],
  ship: [0, 30],
)

p = [3, 30]
# ...
```

```
-----
With 1/2:
Euclidean:
{:tricycle=>1.0, :car=>1.0, :motorcycle=>1.0}
Manhattan:
{:tricycle=>1, :car=>1, :motorcycle=>1}
Cosine:
{:bicycle=>0.9922778767136677, :car=>0.9922778767136677, :motorcycle=>0.98058067569092}
-----
With 15/30:
Euclidean:
{:car=>1.0, :motorcycle=>1.0, :ship=>3.0}
Manhattan:
{:car=>1, :motorcycle=>1, :ship=>3}
Cosine:
{:bicycle=>0.9994594068217016, :car=>0.9994594068217016, :motorcycle=>0.9994522288395831}
```

This is very interesting. Even though the two Boolean values remain in a constant ratio, the search results change (although not significantly).

With an "unbalanced" scale such as 15/100:

* We'll get the same distance results (Euclidean and Manhattan) for other "yes" vectors (100s), since our input is also a yes
* However, the distance from the "no" vectors will be affected. In our example, this doesn't change much, but in a multi-dimensional search, it can have a bigger impact.

```
db.add(
  car: [4, 100],
  bicycle: [2, 15],
  tricycle: [3, 15],
  motorcycle: [2, 100],
  sailboat: [0, 15],
  ship: [0, 100],
)
p = [3, 100]
```

```
With 15/100:
Euclidean:
{:car=>1.0, :motorcycle=>1.0, :ship=>3.0}
Manhattan:
{:car=>1, :motorcycle=>1, :ship=>3}
Cosine:
{:car=>0.9999501235160887, :motorcycle=>0.9999500636867455, :sailboat=>0.9995503035223668}
```

This leads us to talk about the "weight" of a dimension. The reason the search results are affected is because all dimensions are being compared equally in the similarity calculations. For example, in the 15/30 example, there is a distance of 15 points between not having an engine and having one. This means that this is equivalent to a gap of 15 wheels. This makes the distance between yes and no larger than the distance between 2/3/4 wheels. So, given a search vector of "has engine" (= 30), our similarity scores will favour other vectors with an engine much more, even if they fall far of our other criteria.

Conversely, the first version (0.5/1), has a distance of "0.5 wheels" between having an engine and not having one, so the engine part of the query has much less impact (as evidenced by the fact that tricycle ranks highest).

This demonstrates the importance of choosing a good scale. This applies not only to Boolean dimensions: a dimension such as "number of occupants" which can vary from 1 to thousands will affect our search results drastically.

## Multi-dimensional vectors and embeddings

Since we aren't constrained to the 2D graph anymore, we can move further and add all our dimensions.

```
db = VectorDb.new

# Dimensions used are:
# - number of wheels: (0, ...)
# - has engine: (0.5, 1)
# - moves on land: (0.5, 1)
# - max occupants: (1, ...)
vehicles = {
  car: [4, 1, 1, 5],
  bicycle: [2, 0.5, 1, 1],
  tricycle: [3, 0.5, 1, 1],
  motorcycle: [2, 1, 1, 2],
  sailboat: [0, 0.5, 0.5, 20],
  ship: [0, 1, 0.5, 1000],
}
db.add(**vehicles)
```

Let's search for a vehicle which moves on land and can carry 50 people. We don't care about the number of wheels, but we want an engine,

```
p = [nil, 1, 1, 50]
```

Our search algorithm in `find_similar` accounts for this `nil` value by removing any missing dimensions from both search and dataset vectors, so they don't affect the results.

```
Euclidean:
{:sailboat=>30.008332176247315, :car=>45.0, :motorcycle=>48.0}
Manhattan:
{:sailboat=>31.0, :car=>45, :motorcycle=>48}
Cosine:
{:sailboat=>0.9999750508588203, :ship=>0.9996296030790003, :car=>0.9695607054902212}
```

All three measures rank sailboat highest, even though it has no engine and does not move on land. This is because of the weight of the "max occupants" dimension—its large values such as 20 and 1000 will dominate the simple 0.5/1 of the Booleans and 0-4 of the wheels. To make things more even, we can do two things:

1. Change "moves on land" to spread out the values more (for instance, to 20 and 100 instead of 0.5 and 1)
2. Change "occupants" to use buckets, rather than going from 0 to infinity. One such scale could be 1, 2, 3-6, 7-10, 10-15, 15-30, 30-60, 60-100.

There's no "right" result. There are a lot of subjective tuning decisions, which means two data scientists can have the same dataset and same general algorithms, but differing results. Choosing the right dimensions, choosing which dimensions to *drop* to avoid overfitting results, choosing dimensions could at query time, choosing how to represent dimensions, etc.

In the real world, we deal with more data like this—sentences, paragraphs, topics, products, images, etc. As you can see, this process of determining dimensions ([feature engineering](https://en.wikipedia.org/wiki/Feature_engineering)) can be quite difficult and time-consuming. Not only do you need to be intensely familiar with the data (gigabytes? terabytes? petabytes?) in order to recognize what dimensions are important, you also need to experiment to find the most suitable dimensions.

Additionally, there's the task of converting the input to a vector (except in recommender systems), which requires automated semantic analysis.

There is an alternative. With [vector embeddings](https://www.pinecone.io/learn/vector-embeddings/), you can train a model (or use a pretrained model) which handles this, classifying the dataset to come up with several dimensions. For better results in specialised domains, you may still want to combine with some manual feature extraction.

Let's play with embeddings a bit. We'll use this library, [@xenova/transformers](https://www.npmjs.com/package/@xenova/transformers). Transformers are one technique for generating embeddings of text. Using a library rather than an API means that all analysis and classification is done locally, so the library must come with its own inbuilt corpus of words. (This library's size is 46 MB!)

I couldn't find any libraries for Ruby, so this means porting the vector database to JavaScript:

```
class VectorDb {
  vectors = {};

  add(newVectors) {
    Object.assign(this.vectors, newVectors)
  }

  findSimilar(searchVector, measure, results = 3) {
    let vectorsWithDistances =
      Object.entries(this.vectors).map(([otherVectorName, otherVectorDimensions], _) => {
      let normalizedSearchVector = searchVector.filter(d => d !== null);
      let normalizedOtherVector =
        otherVectorDimensions.filter((b_i, i) => searchVector[i] !== null)
      return [otherVectorName, this.distance(normalizedSearchVector, normalizedOtherVector, measure)]
    }).sort((v1, v2) => v1[1] - v2[1]);

    return Object.fromEntries(
      measure === 'cosine' ?
      vectorsWithDistances.reverse().slice(0, results)
      : vectorsWithDistances.slice(0, results)
    );
  }

  distance(vector, otherVector, measure) {
    return this[measure].call(this, vector, otherVector)
  }

  euclidean(vec_a, vec_b) {
    return Math.sqrt(
      this.sumForEach((a_i, b_i) => (a_i - b_i) ** 2, vec_a, vec_b)
    )
  }

  manhattan(vec_a, vec_b) {
    return this.sumForEach((a_i, b_i) => Math.abs(a_i - b_i), vec_a, vec_b)
  }

  dotProduct(vec_a, vec_b) {
    return this.sumForEach((a_i, b_i) => a_i * b_i, vec_a, vec_b)
  }

  cosine(vec_a, vec_b) {
    return this.dotProduct(vec_a, vec_b) / (this.magnitude(vec_a) * this.magnitude(vec_b))
  }

  magnitude(vec) {
    return Math.sqrt(this.sumForEach(v_i => v_i ** 2, vec))
  }

  sumForEach(fn, ...vectors) {
    return vectors[0].reduce((acc, v_i, i) => {
      return acc + fn(...vectors.map(v => v[i]));
    }, 0);
  }
}
```

Now, rather than manually create vectors, we only use the words, and the transformers library does this for us.

```
import { pipeline } from '@xenova/transformers';
let extractor = await pipeline('feature-extraction');
let generateEmbedding = (word) => extractor(word, { pooling: "mean", normalize: true })

let vehicles = [
  'car',
  'bicycle',
  'tricycle',
  'motorcycle',
  'sailboat',
  'ship',
]

let vehicleEmbeddings = await Promise.all(vehicles.map(name => generateEmbedding(name)))
let vehiclesMap = Object.fromEntries(vehicles.map((name, i) => [name, vehicleEmbeddings[i]]))
```

This takes a few seconds to run on my machine the first time (not much, but noticeable), which shows that running ML models, even ones as small as this involve a lot of CPU time.

If you're curious to see what the generated embeddings look like, here's what the embedding for `car` is:

```
Tensor {
  dims: [ 1, 384 ],
  type: 'float32',
  data: Float32Array(384) [
    -0.031706273555755615,     0.1090739443898201,   0.012603563256561756,
      0.05875611677765846,   -0.03913160786032677,   0.032443128526210785,
    ... 378 more items
  ],
  size: 384
}
```

This thing is huge! I'm not familiar with the details, but it appears that "car" has been turned into a 384-dimension vector.

Let's see how the search does. We can't put in a random vector as before, since the embeddings are now controlled by the transformer, but let's see what happens when we search for a vehicle not in our dataset.

```
async function search(word) {
  let p = await generateEmbedding(word)
  console.log("Euclidean:")
  console.log(db.findSimilar(p, 'euclidean'))
  console.log("Manhattan:")
  console.log(db.findSimilar(p, 'manhattan'))
  console.log("Cosine:")
  console.log(db.findSimilar(p, 'cosine'))
}
search('e-bike')
```

```
Euclidean:
{
  bicycle: 0.8344609209916007,
  motorcycle: 0.8977509140426253,
  tricycle: 0.9996304153817714
}
Manhattan:
{
  bicycle: 13.002568852846004,
  motorcycle: 13.984138461616215,
  tricycle: 15.961311867872588
}
Cosine:
{
  bicycle: 0.6518374948251899,
  motorcycle: 0.597021662747392,
  tricycle: 0.5003696104110993
}
```

These are pretty good results. An e-bike is indeed most similar to a bicycle (it is a kind of bicycle), and then a motorbike, and a distant cousin, the tricycle. All three measures return similar rankings.

Searching for "truck":

```
Euclidean:
{
  car: 0.8310878560616409,
  motorcycle: 0.9929289945588754,
  bicycle: 1.005725251152928
}
Manhattan:
{
  car: 12.967854919763596,
  motorcycle: 15.50279750485964,
  bicycle: 15.86006192120071
}
Cosine:
{
  car: 0.6546464440552332,
  motorcycle: 0.5070459014501628,
  bicycle: 0.4942582474585483
}
```

And searching for "speedboat":

```
Euclidean:
{
  sailboat: 0.688214933677928,
  ship: 0.9114324817410895,
  car: 1.0909516960778003
}
Manhattan:
{
  sailboat: 10.658648524569825,
  ship: 14.01096388567844,
  car: 16.868695075216202
}
Cosine:
{
  sailboat: 0.7631800985510027,
  ship: 0.5846454070601506,
  car: 0.40491218686683284
}
```

Nice!

***

Well, that was pretty cool. We started with looking at vectors and bridging them to dimensions for non-numerical items, and we ended with building our own vector search engine and using a transformer to generate the vectors. This is still a long way from anything you'd use in production, but it's a good start in understanding what goes on under the hood.

## Interesting reads

The [tweet](https://twitter.com/swyx/status/1706833291507335363) and [demo](https://github.com/swyxio/gptapiexperiment/blob/main/segfault.mjs) that gave me the idea for this post.

These aren't specifically about vector search, but explain some of the foundations:

* Khan Academy: [Linear Algebra](https://www.khanacademy.org/math/linear-algebra) (vectors)
* MIT OpenCourseWare: [Introduction to Machine Learning](https://www.youtube.com/watch?v=h0e2HAPTGF4)

On vector search:

* Algolia has a good intro to vector search: <https://www.algolia.com/blog/ai/what-is-vector-search/>
* Meilisearch, on combining full-text search and vector search: [Full-text search vs vector search](https://blog.meilisearch.com/full-text-search-vs-vector-search/)
* Elasticsearch docs on how to tune [k-Nearest Neighbour search](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html%7C) (a form of vector search) in Elasticsearch

Applications:

* [Comparing vector search in eCommerce to other search approaches](https://opensourceconnections.com/blog/2023/03/15/revolutionizing-e-commerce-search-with-vectors/)
* [How Spotify Uses Semantic Search for Podcasts](https://www.pinecone.io/learn/series/wild/spotify-podcast-search/)
* [Vector embeddings + personalized search](https://docs.coveo.com/en/l9gg3565/coveo-for-commerce/product-embeddings-and-vectors)

On feature engineering:

* [Two](https://medium.com/@abdallahashraf90x/feature-engineering-in-nlp-a784d683bfce) [posts](https://towardsdatascience.com/nlp-101-%E2%85%93-feature-engineering-and-word-embeddings-f10dffd67bb0) explaining feature engineering in Natural Language Processing.

On vector databases:

* [Comparison of vector databases](https://benchmark.vectorview.ai/vectordbs.html)

***

<!-- For rendering maths equations -->


  