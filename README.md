### Confusion matrix & accuracy test 1
- epochs: 50
- batch size: 10

Accuracy: 70.33333333333334%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 98        | 0     | 2     |
| Drawn              | 0         | 13    | 87    |
| Fired              | 0         | 0     | 100   |

#### Conclusion
Drawn gets confused with fired. Possible actions?
- Effect of changing batch size & epochs?

### Confusion matrix & accuracy test 2
- epochs: 100
- batch size: 5

Accuracy: 72%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 94        | 6     | 3     |
| Drawn              | 0         | 97    | 3     |
| Fired              | 0         | 75    | 25    |

#### Conclusion
Drawn & fired are still being confused. Batch & epochs does not seem to affect this. Loss stabilises.
- Add more training data
- Increase the weights of the thumb landmarks.

### Confusion matrix & accuracy test 3
- epochs: 50
- batch size: 10

Accuracy: 70.33333333333334%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 98        | 0     | 2     |
| Drawn              | 0         | 13    | 87    |
| Fired              | 0         | 0     | 100   |

#### Conclusion
Drawn gets confused with fired. Possible actions?