/*
  ===============================================
  Example sketch for CurieIMU library for Intel(R) Curie(TM) devices.
  Copyright (c) 2015 Intel Corporation.  All rights reserved.

  Based on I2C device class (I2Cdev) demonstration Arduino sketch for MPU6050
  class by Jeff Rowberg: https://github.com/jrowberg/i2cdevlib

  ===============================================
  I2Cdev device library code is placed under the MIT license
  Copyright (c) 2011 Jeff Rowberg

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  ===============================================

  Genuino 101 CurieIMU Orientation Visualiser
  Hardware Required:
  * Arduino/Genuino 101

  Modified Nov 2015
  by Helena Bisby <support@arduino.cc>
  This example code is in the public domain
  http://arduino.cc/en/Tutorial/Genuino101CurieIMUOrientationVisualiser

  Modified Apr 2016 for Moorthy's Open Source class at RPI
  by Jorel Lalicki
*/

#include <CurieIMU.h>
#include "CurieTimerOne.h"
//#define private public  - "don't do this" - for accessing quaternions in sensor fusion class
#include <MadgwickAHRS.h>
//#undef private


#define calibrateOffsets  1 // int to determine whether calibration takes place or not
#define factor 800 // variable by which to divide gyroscope values, used to control sensitivity


Madgwick filter; // initialise Madgwick object
int ax, ay, az;
int gx, gy, gz;

void sampleimu()
{
   // read raw accel/gyro measurements from device
  CurieIMU.readMotionSensor(ax, ay, az, gx, gy, gz); 
 
  // use function from MagdwickAHRS.h to return quaternions
  filter.updateIMU(gx / factor, gy / factor, gz / factor, ax, ay, az);    
  }

void setup() {
  // initialize Serial communication
  Serial.begin(115200);

  // initialize device
  CurieIMU.begin();
  
  if (calibrateOffsets == 1) {
    // use the code below to calibrate accel/gyro offset values
    Serial.println("Internal sensor offsets BEFORE calibration...");
    Serial.print(CurieIMU.getAccelerometerOffset(X_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Y_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Z_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getGyroOffset(X_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getGyroOffset(Y_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getGyroOffset(Z_AXIS)); Serial.print("\t");
    Serial.println("");

    //Set up range and sampling rate of Gyro    
    CurieIMU.setGyroRate(200);  //200Hz
    CurieIMU.setGyroRange(2000); //+- 2000 deg/sec
    
    //Set up range and sampling rate of accelerometer
    CurieIMU.setAccelerometerRange(16); //+- 8G
    CurieIMU.setAccelerometerRate(200);  //200Hz
    //IMU device must be resting in a horizontal position for the following calibration procedure to work correctly!

    Serial.print("Starting Gyroscope calibration...");
    CurieIMU.autoCalibrateGyroOffset();
    Serial.println(" Done");
    Serial.print("Starting Acceleration calibration...");
    CurieIMU.autoCalibrateAccelerometerOffset(X_AXIS, 0);
    CurieIMU.autoCalibrateAccelerometerOffset(Y_AXIS, 0);
    CurieIMU.autoCalibrateAccelerometerOffset(Z_AXIS, 1);
    Serial.println(" Done");

    Serial.println("Internal sensor offsets AFTER calibration...");
    Serial.print(CurieIMU.getAccelerometerOffset(X_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Y_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Z_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(X_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Y_AXIS)); Serial.print("\t");
    Serial.print(CurieIMU.getAccelerometerOffset(Z_AXIS)); Serial.print("\t");
    Serial.println("");

    //Set up timer interrupt
    CurieTimerOne.start(5000, &sampleimu); // set timer and callback
  }
}

void loop() {
 
  
  // print gyro and accel values for debugging only, comment out when running Processing script
  /*
  Serial.print(ax); Serial.print("\t");
  Serial.print(ay); Serial.print("\t");
  Serial.print(az); Serial.print("\t");
  Serial.print(gx); Serial.print("\t");
  Serial.print(gy); Serial.print("\t");
  Serial.print(gz); Serial.print("\t");
  Serial.println("");
  */

  if (Serial.available() > 0) {
    int val = Serial.read();
    if (val == 's') { // if incoming serial is "s"
        // functions to find yaw roll and pitch from quaternions
      float yaw = filter.getYaw();
      float pitch = filter.getRoll();
      float roll = filter.getPitch();
      
      Serial.print(yaw);
      Serial.print(","); // print comma so values can be parsed
      Serial.print(pitch);
      Serial.print(","); // print comma so values can be parsed
      Serial.println(roll);
    }
  }
}
