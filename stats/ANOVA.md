- WHY TO USE : While a $t$-test is great for comparing the averages of two groups, what happens if you want to compare three or more groups? 
For example, testing three different study techniques, or four different fertilizers on plant growth.You could run multiple $t$-tests (A vs B, B vs C, A vs C), but doing that increases the chance of a false positive. Instead, we use ANOVA (Analysis of Variance).
- INTUITION :  The Signal vs. The Noise. 
ANOVA works by breaking down the total variation in your data into two distinct parts:

  - Between-Group Variance (The Signal): How far apart are the averages of the different groups from each other?
    If the study techniques have very different effects, this variance will be large.

  - Within-Group Variance (The Noise): How spread out are the individual scores inside each group?
    Even with the best study technique, not everyone gets the exact same score. This is natural, random noise.
    
# ASSUMPTIONS : 
The variances within the group has to be same for test to be valid. 
<img width="1733" height="679" alt="image" src="https://github.com/user-attachments/assets/b67f2f17-5e45-4f66-be0e-744fc07db931" />


ANOVA takes these two pieces and creates a ratio called the $F$-statistic: \
$F = \frac{\text{Between-Group Variance}}{\text{Within-Group Variance}}$ \

<img width="1242" height="765" alt="image" src="https://github.com/user-attachments/assets/241c5fa7-e282-4cf1-a436-ea51133f2f6b" />



where : 
k = number of groups
$y_i$ : sample inside a group \
$\bar{y_i}$ : average of values within a group \
$\bar{y}$ : grand average of all values \



HIGH SIGNIFICANCE : \
<img width="687" height="587" alt="image" src="https://github.com/user-attachments/assets/4c38a720-5cf4-459a-9b12-11c5604332c3" />

LOW SIGNIFICANCE : \
<img width="691" height="537" alt="image" src="https://github.com/user-attachments/assets/0b1b8409-802d-4b3a-8b85-0ab315bff0c4" />

