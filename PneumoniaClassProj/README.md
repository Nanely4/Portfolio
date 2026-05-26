# Chest X-Ray Classification for Pneumonia

# Overview
Classification of chest X-ray images through the use of custom neural networks

# Images
1. Shows the predicted outcome of the chest_xray images
<img width="775" height="146" alt="chestproj1" src="https://github.com/user-attachments/assets/e709fb77-5f08-44c4-9610-ed319c1c15d2" />

3. Shows the actual outcome of the chest_xray images
<img width="761" height="285" alt="chestproj2" src="https://github.com/user-attachments/assets/df994635-5255-4a9c-bfe3-6c276bd26c7e" />

# Dataset

- Source: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia/?select=chest_xray

- Details: This dataset contains chest x-ray images, where some are classified as "pneumonia" and the rest as "normal". The dataset is split into two different sets: one called "Train" and the other called "Test". We will be using these sets to train and test some algorithms, such as PCA and Neural Networks, maybe kmeans, that we will use later on. The train set contains a total of 5216 images: 1341 normal and 3875 pneumonia. The test set contains a total of 624 images: 390 normal and 234 pneumonia.

- Preprocessing: Since the images in the dataset had different sizes, I decided to grayscale my images and then resize them to (100,100), that way they all have the same size to be analyzed later

# Model and Algorithms
- KMeans Clustering (need to work on it more)
- PCA on Train Dataset (Analysis from Part 2)
  - PCA on both normal and pneumonia
  - PCA on pneumonia only
  - PCA on normal only
- TSNE on Train Dataset
- Convolutional Neural Network for Image Classification
  - Change 1: Adding Class Weight
  - Change 2: Trying a Different Hyperparameter (learning rate = 0.0001)
  - Change 3: Trying a Different Batch Size (batch_size = 32)
  - Change 4: Training our Network for Longer epochs (epochs = 50)
  - Change 5: Trying a Different Optimizer (ADAM)

  - Frameworks: Torch, Torchvision
 
  # Results
  - Best model reached 81% accuracy, but must check for baseline accuracy first for comparison
 
  # Future work
  - Would like to compare my model's accuracy with baseline to see if my model is better than random model (logistic regression)
