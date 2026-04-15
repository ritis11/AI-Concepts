- The Chi-Square test of independence is a statistical method used to determine if there is a significant relationship between two categorical variables. 
- It works by comparing the data you actually collected (the observed values) with the data you would expect to see if the variables were completely unrelated (the expected values).
- If the observed values are very different from the expected values, it suggests that the variables are likely connected in some way.
- Creating the Expected Values TableTo create the expected values table, we operate under the assumption that the two variables have no effect on each other.
- We use the totals from our observed data—specifically the row totals, column totals, and the overall grand total—to calculate these expected baseline numbers.
- For every single cell in your table, you calculate the expected value using this formula:

  <img width="308" height="77" alt="image" src="https://github.com/user-attachments/assets/372dd43e-cfd0-4931-824c-224a1c246463" />

  We calculate this because : 
  
  <img width="209" height="45" alt="image" src="https://github.com/user-attachments/assets/3b4723e8-da6b-4942-ac57-b8823cb273a1" />
  
  If two events are completely independent (meaning they have no effect on each other),
  the chance of both happening is their individual probabilities multiplied together: $P(A \text{ and } B) = P(A) \times P(B)$.
  
  This means $E(A \text{ and } B) = n \times P(A) \times P(B)$.
  e.g. : \
  $P(unmarried) = \text{Sum of total unmarried} / \text{total number people}$

  Now, we have the below table \

  <img width="669" height="501" alt="image" src="https://github.com/user-attachments/assets/807638dc-917d-41d2-bea9-bb1df895b658" />

  Next we calculate :

  The formula for the Chi-Square statistic
  $\chi^2$ brings together the observed $O$ and expected $E$ values for every cell in your data table:
  $\chi^2 = \sum \frac{(O - E)^2}{E}$

   <img width="517" height="240" alt="image" src="https://github.com/user-attachments/assets/1a831212-c89e-47fc-b348-2c834f53f706" />

  - You have your final calculated $\chi^2$ number, but a number on its own doesn't mean much unless you have a threshold to compare it against.
  - Here is how you interpret that final score:
  -   - A score of $0$: Your observed data perfectly matched the expected baseline. The variables are completely independent (unrelated).
      - A larger score: The gap between what you observed and what you expected is growing.
      - To determine if the score is large enough to confidently say the variables are related, we use a threshold called a Critical Value.
      - To find this critical value threshold, you need two pieces of information:
      -   Significance Level ($\alpha$): This is the $p$-value threshold we discussed earlier, usually set at $0.05$ ($5\%$).Degrees of Freedom ($df$):
      -   For a contingency table, this is based on the number of rows and columns.
      -   The formula is: $df = (\text{Rows} - 1) \times (\text{Columns} - 1)$.
      -   Just like the $t$-distribution, the Chi-Square test has its own probability distribution curve.
      -   We plot your calculated $\chi^2$ score on this curve to see if it lands in the extreme "tail" region.
      -   You can use this tool to see how your $\chi^2$ score compares to the critical threshold based on the degrees of freedom and your chosen significance level.
      -   <img width="687" height="601" alt="image" src="https://github.com/user-attachments/assets/866322ec-0b40-4972-912a-ed7ee07778ae" />
      -   <img width="700" height="506" alt="image" src="https://github.com/user-attachments/assets/4c5e8b23-18d1-4f2d-a89e-b45984a5f892" />




  

