import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  CameraRoll,
  Dimensions
} from 'react-native';
import Camera from 'react-native-camera';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 20,
    color: 'red'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});
// <Text>IMAGE HERE</Text>
const { width } = Dimensions.get('window')

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrtsK4m-Cwos38-5iXaeJDmfL722xGeRg",
  authDomain: "jugaweddingappsandbox.firebaseapp.com",
  databaseURL: "https://jugaweddingappsandbox.firebaseio.com/",
  storageBucket: "gs://jugaweddingappsandbox.appspot.com/",,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


class PreviewPicture extends  React.Component {

  savePictureToFirebase = (image) => {
    console.log("save picture to firebase");
  }

  render() {
    console.log("should render picture");
    console.log("image url 2" + this.props.imageUrl);
    return (
      <View style={styles.container}>

          <Image
            style={{ flex: 1, resizeMode: 'cover' }}
            source={{uri: this.props.imageUrl}}
          />
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableOpacity
                style={styles.captureButton}
                onPress={this.savePictureToFirebase}
            >
              <Image
                  source={require('./assets/send_button.png')}
              />
            </TouchableOpacity>
          </View>

      </View>
    );
  }
}

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.front,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false,
      isPreview: false,
      previewUrl: '',
      photoUrl: ''
    };
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => this.previewPicture(data))
        .catch(err => console.error(err));
    }
  }

  previewPicture = (data) => {
    this.setState({
      previewUrl: data["path"]
    });
    this.getPhotos();
  }

  getPhotos = () => {
    console.log("get photos is called");
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then(r => this.presentPhotos(r.edges))
  }

  presentPhotos = (images) => {
    console.log("present photos is Called");
    console.log(images)
    let imageUrl = images[0].node.image.uri;
    console.log("imageUrl")
    console.log(imageUrl)
    this.setState({photoUrl: imageUrl, isPreview:true});
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
          .then((data) => console.log(data))
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }

    return icon;
  }

  render() {
    if (this.state.isPreview){
      return(
        <View style={styles.container}>
          <PreviewPicture imageUrl={this.state.photoUrl}/>
        </View>
      );
    } else if (!this.state.isPreview) {
      return (
        <View style={styles.container}>
          <StatusBar
            animated
            hidden
          />
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={this.state.camera.aspect}
            captureTarget={this.state.camera.captureTarget}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            defaultTouchToFocus
            mirrorImage={false}
          />
          <View style={[styles.overlay, styles.topOverlay]}>
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
            >
              <Image
                source={this.typeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
              <Image
                source={this.flashIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.takePicture}
              >
                <Image
                    source={require('./assets/ic_photo_camera_36pt.png')}
                />
              </TouchableOpacity>
              ||
              null
            }
            <View style={styles.buttonsSpace} />
            {
                !this.state.isRecording
                &&
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={this.startRecording}
                >
                  <Image
                      source={require('./assets/ic_videocam_36pt.png')}
                  />
                </TouchableOpacity>
                ||
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={this.stopRecording}
                >
                  <Image
                      source={require('./assets/ic_stop_36pt.png')}
                  />
                </TouchableOpacity>
            }
          </View>
        </View>
      );
    }
  }
}
