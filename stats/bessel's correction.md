### Why do we change from n to n-1 in calculation std.dev population vs sample?

1. Compensating for "Bias"When calculating variance for a sample, we do not usually know the true population mean (\(\mu \)), so we use the sample mean (\(\={x}\)) instead. By definition, the sample mean is the value that minimizes the sum of squared deviations for that specific set of data.
2. This means the data points in a sample will always be "closer" to their own sample mean than they are to the actual population mean.
3. Dividing by \(n\) would produce a value that is too small (biased).Dividing by \(n-1\) (a smaller number) increases the result, providing an unbiased estimate that more accurately reflects the true population variance.2. Degrees of Freedom
4. In a sample of \(n\) observations, we have \(n\) independent pieces of information. However, to calculate variance, we must first calculate the sample mean.
5. Once the sample mean is fixed, only \(n-1\) of those data points are "free to vary"—the last point is mathematically determined to ensure the mean remains the same.
6. We "lose" one degree of freedom to the mean, so we divide by the remaining \(n-1\).3. Captured ExtremesSmall samples are less likely to include the "extreme" values (outliers) that exist in the full population.
7. This naturally makes the sample appear less spread out than the population really is. The \(n-1\) adjustment "boosts" the variance to account for these missing extremes.
8. Comparison :
   
   
   <img width="706" height="250" alt="image" src="https://github.com/user-attachments/assets/e4e7e25f-bc94-4af4-b147-5f55a47bc776" />
