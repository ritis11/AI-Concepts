To understand linear regression from a Maximum Likelihood Estimation (MLE) perspective, it is incredibly helpful to see how the mathematical assumptions directly translate into the equation for the loss function. MLE is simply a framework that asks: **"What are the most likely model parameters that would have generated the data we actually observed?"**

Here is a breakdown of the assumptions and how they guide the mathematical derivation.

---

## The Four Core Assumptions

Every assumption in linear regression serves a specific, mathematical purpose when deriving the model through MLE. 

* **Linearity:** We assume that the relationship between the features ($X$) and the target ($y$) is fundamentally linear. Mathematically, this means the expected value of our prediction is a straight-line combination of our weights and features: $\theta^T x$.
* **Independence:** We assume that every data point is independent of the others. The error of one prediction does not inform or affect the error of another. This allows us to calculate the joint probability of all our data by simply multiplying their individual probabilities together.
* **Homoscedasticity (Constant Variance):** We assume that the variance of the errors is constant across all predicted values. Whether the model predicts a small number or a large number, the spread of the potential errors remains the same (denoted as $\sigma^2$). 
[Image of homoscedasticity vs heteroscedasticity scatter plot]
* **Normality of Errors:** We assume the errors (residuals) are distributed normally (following a Gaussian distribution) around zero. Most errors will be small (close to zero), and large errors will be rare. 
[Image of normal distribution of residuals in linear regression]

---

## Deriving the Loss Function via MLE

Let's translate those assumptions into the MLE equations. 

**1. Define the Model and Error**
Given a single data point with features $x^{(i)}$ and actual target $y^{(i)}$, we define the prediction as a linear combination (Linearity assumption). The true value $y^{(i)}$ is the linear prediction plus some error $\epsilon^{(i)}$:

$$y^{(i)} = \theta^T x^{(i)} + \epsilon^{(i)}$$

**2. Formulate the Probability Density Function (PDF)**
Because of our **Normality** assumption, the error term $\epsilon^{(i)}$ follows a normal distribution with a mean of $0$ and a variance of $\sigma^2$ (which is constant due to the **Homoscedasticity** assumption). 

$$\epsilon^{(i)} \sim \mathcal{N}(0, \sigma^2)$$

The probability density function for this normal distribution is:

$$p(\epsilon^{(i)}) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(\epsilon^{(i)})^2}{2\sigma^2}\right)$$

Since $\epsilon^{(i)} = y^{(i)} - \theta^T x^{(i)}$, we can substitute this into the equation. This gives us the conditional probability of seeing a specific target $y^{(i)}$ given the input $x^{(i)}$ and our parameters $\theta$:

$$p(y^{(i)} | x^{(i)}; \theta) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y^{(i)} - \theta^T x^{(i)})^2}{2\sigma^2}\right)$$

**3. The Likelihood Function**
MLE aims to maximize the probability of observing the entire dataset. Because of the **Independence** assumption, the total probability of observing all $n$ data points is just the product of their individual probabilities. This is called the Likelihood function, $L(\theta)$:

$$L(\theta) = \prod_{i=1}^{n} p(y^{(i)} | x^{(i)}; \theta)$$
$$L(\theta) = \prod_{i=1}^{n} \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y^{(i)} - \theta^T x^{(i)})^2}{2\sigma^2}\right)$$

**4. The Log-Likelihood Function**
Multiplying many small probabilities together leads to numbers too small for computers to handle (underflow), and products are mathematically difficult to differentiate. Because the logarithm is a strictly increasing function, maximizing the logarithm of the likelihood is the same as maximizing the likelihood itself. We define the Log-Likelihood, $\ell(\theta)$:

$$\ell(\theta) = \log L(\theta) = \sum_{i=1}^{n} \log \left[ \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y^{(i)} - \theta^T x^{(i)})^2}{2\sigma^2}\right) \right]$$

Using the properties of logarithms ($\log(ab) = \log(a) + \log(b)$ and $\log(\exp(x)) = x$), this simplifies beautifully:

$$\ell(\theta) = n \log\left(\frac{1}{\sqrt{2\pi\sigma^2}}\right) - \frac{1}{2\sigma^2} \sum_{i=1}^{n} (y^{(i)} - \theta^T x^{(i)})^2$$

**5. Extracting the Loss Function**
Our goal is to find the parameters $\theta$ that maximize $\ell(\theta)$. 

Look closely at the final log-likelihood equation. The first term, $n \log\left(\frac{1}{\sqrt{2\pi\sigma^2}}\right)$, is a constant with respect to $\theta$. The parameter $\theta$ only exists in the second term. 

Therefore, maximizing the total equation requires us to **maximize the negative term**, which is mathematically identical to **minimizing the positive version of that term**:

$$\text{Minimize: } \frac{1}{2} \sum_{i=1}^{n} (y^{(i)} - \theta^T x^{(i)})^2$$

This final equation is the **Sum of Squared Errors (SSE)**, which is the un-averaged form of the **Mean Squared Error (MSE)** loss function (often multiplied by $1/2$ to make the derivative cleaner during gradient descent calculation). 

By assuming normally distributed errors, the Maximum Likelihood Estimation naturally dictates that minimizing the squared differences between the predictions and the actuals is the optimal way to find the best-fit line.
