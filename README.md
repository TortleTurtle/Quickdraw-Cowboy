# Quickdraw Cowboy

## Installation
1. clone the git repo.
2. `cd` into `/Game`
3. run `npm install`
4. run `npm run start`
5. A new tab will open with Quickdraw Cowboy

Instructions are the same for the model trainer.

## Tests
### Confusion matrix & accuracy test 1
- epochs: 50
- batch size: 10

Accuracy: 70.3%

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
- batch size: 5
- Thumb weight x2

Accuracy: 66.6%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 95        | 0     | 5     |
| Drawn              | 0         | 5     | 95    |
| Fired              | 0         | 0     | 100   |

#### Conclusion
Thumb weight increase seems to have no effect. Add more data?

### Confusion matrix & accuracy test 4
- drawn & fired have 100 extra samples.
- epochs: 50
- batch size: 5
- thumb weight: x10

Accuracy: 62%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 76        | 24    | 0     |
| Drawn              | 0         | 94    | 6     |
| Fired              | 0         | 84    | 16    |

#### Conclusion
Accuracy only drops, increasing weight is not an option.
Choose a different 3rd pose?

### Confusion matrix & accuracy test 5
- new pose for fired.
- epochs: 50
- batch size: 5

Accuracy: 100%

| Actual \ Predicted | Holstered | Drawn | Fired |
|--------------------|-----------|-------|-------|
| Holstered          | 100       | 0     | 0     |
| Drawn              | 0         | 100   | 0     |
| Fired              | 0         | 0     | 100   |

#### Conclusion
Bullseye