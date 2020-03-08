import numpy as np
import matplotlib.pyplot as plt
import cv2

if __name__ == '__main__':
    infile = 'loading_2.png'

    img = cv2.imread(infile, cv2.IMREAD_UNCHANGED)
    print(img.shape)

    # plt.imshow(img)
    # plt.show()

    scale = 2
    _img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_NEAREST)
    print(_img.shape)
    # plt.imshow(_img)
    # plt.show()

    cv2.imwrite('_loading_2.png', _img)
