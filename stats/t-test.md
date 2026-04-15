The probability density function (PDF) of Student's t-distribution is defined by the following equation:
<img width="300" height="96" alt="image" src="https://github.com/user-attachments/assets/a38ca3e9-bae9-4159-9870-2c8c59634a6d" />

Here is a breakdown of the variables in the equation:$t$: The random variable (the t-value).$\nu$ (nu): The degrees of freedom. 
This parameter completely determines the shape of the distribution.$\Gamma$ (Gamma): The Gamma function, which is a continuous extension of the factorial function (for positive integers $n$, $\Gamma(n) = (n-1)!$).The t-distribution looks similar to a standard normal distribution (bell curve) but has "heavier tails," meaning it is more prone to producing values that fall far from its mean. 
This is especially true when $\nu$ is small. As the degrees of freedom increase, the t-distribution curve approaches the standard normal distribution.

<img width="685" height="602" alt="image" src="https://github.com/user-attachments/assets/959095b6-3290-449c-b1ff-474b0f1242f8" />

Think of the $t$-value as a measure of distance. It tells you how far your observed sample result is from what you expected to happen (the center of the distribution).Here is what the different values signify for your results:Mid-values (close to $0$): Your result landed right near the expected average. If you are running an experiment, a $t$-value near zero suggests your observed result is ordinary and likely just due to random chance.Extreme values (high positive or low negative numbers): Your result landed far out in those "heavy tails" we discussed. An extreme $t$-value is a statistical surprise. It signifies that your result is highly unusual compared to your baseline expectation. In research, this is the zone of "statistical significance," indicating that your experiment likely uncovered a real effect rather than just random noise.

<img width="694" height="592" alt="image" src="https://github.com/user-attachments/assets/8031f460-3274-4c30-a8a3-98c1d9e04822" />


- If the $t$-value already tells us how far away our result is from the expectation, adding another metric might seem redundant.
- The main reason we use $p$-values is for universal standardization.Here is why $t$-values alone can be tricky: a $t$-value's meaning changes depending on your degrees of freedom (sample size).
- A $t$-value of $2.5$ is highly unusual if you have 100 degrees of freedom, but it is much more common if you only have 3 degrees of freedom.Think of $t$-values like different global currencies. Knowing you have "2.5" of something doesn't tell you its actual value unless you also know the exchange rate (the degrees of freedom).The $p$-value acts as the universal currency. It takes your $t$-value and your degrees of freedom and calculates the actual probability (the shaded area from our last graph).$t$-value: "My result is $2.5$ standard steps away from the center."$p$-value: "Because it is $2.5$ steps away, there is only a $1.5\%$ chance ($p = 0.015$) of seeing a result this extreme if our baseline assumption was true."Because $p$-values are always probabilities (ranging from $0$ to $1$), you can compare them across any experiment, regardless of the sample size or the specific statistical test used.
As the $t$-value moves further away from the center, the area in the tail shrinks, which means the $p$-value decreases.
A very small $p$-value tells you that it is highly unlikely to observe your specific results if the baseline assumption (the expected center) were actually true.In research, we usually set a threshold for this $p$-value to decide if a result is significant enough to reject that baseline assumption. A very common threshold is $0.05$ (or $5\%$). If the $p$-value drops below this line, the result is considered "statistically significant," meaning we believe we've found a real effect rather than just a random fluke.

