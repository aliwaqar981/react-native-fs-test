/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} = React;

var RNFS = require('react-native-fs');

var testDir1Path = RNFS.DocumentDirectoryPath + '/test-dir-1';
var testFile1Path = RNFS.DocumentDirectoryPath + '/test-dir-1/test-file-1';
var testFile2Path = RNFS.DocumentDirectoryPath + '/test-dir-1/test-file-2';

var downloadUrl = 'http://facebook.github.io/react-native/img/opengraph.png';

var RNFSApp = React.createClass({
  getInitialState: function() {
    return { output: '' };
  },

  mkdirTest: function() {
    return RNFS.mkdir(testDir1Path).then(success => {
      var text = success.toString();
      this.setState({ output: text });
    }).catch(err => this.showError(err));
  },
  writeNestedTest: function() {
    return RNFS.writeFile(testFile1Path, 'I am a file in the directory', 'ascii').then(() => {
      this.setState({ output: 'Files written successfully' });
    }).catch(err => this.showError(err));
  },
  readNestedTest: function() {
    return RNFS.readFile(testFile1Path).then((data) => {
      this.setState({ output: 'Contents: ' + data });
    }).catch(err => this.showError(err));
  },
  readDirNestedTest: function() {
    return RNFS.readDir(testDir1Path).then(files => {
      var text = files.map(file => file.name + ' (' + file.size + ') (' + (file.isDirectory() ? 'd' : 'f') + ')').join('\n');
      this.setState({ output: text });
    }).catch(err => this.showError(err));
  },
  deleteNestedTest: function() {
    return RNFS.unlink(testFile1Path).then(success => {
      var text = success.toString();
      this.setState({ output: text });
    }).catch(err => this.showError(err));
  },
  deleteDirTest: function() {
    return RNFS.unlink(testDir1Path).then(success => {
      var text = success.toString();
      this.setState({ output: text });
    }).catch(err => this.showError(err));
  },

  downloadFileTest: function() {
    return RNFS.downloadFile(downloadUrl, testFile2Path).then(success => {
      this.setState({ output: testFile2Path });
      this.setState({ imagePath: { uri: 'file://' + testFile2Path } });
    }).catch(err => this.showError(err));
  },

  assert: function(name, val, exp) {
    if (exp !== val) throw new Error(name + ': "' + val + '" should be "' + exp + '"');
    this.setState({ output: name });
  },

  autoTest1: function() {
    var f1 = RNFS.DocumentDirectoryPath + '/f1';

    return Promise.resolve().then(() => {
      return RNFS.writeFile(f1, 'foo © bar 𝌆 baz', 'utf8').then(result => {
        this.assert('Write F1', result[0], true);
      });
    }).then(() => {
      return RNFS.readdir(RNFS.DocumentDirectoryPath).then(files => {
        this.assert('F1 Visible', files.indexOf('f1') !== -1, true);
      });
    }).then(() => {
      return RNFS.readFile(f1, 'utf8').then(contents => {
        this.assert('Read F1', contents, 'foo © bar 𝌆 baz');
      });
    }).then(() => {
      return RNFS.stat(f1).then(info => {
        this.assert('Stat', info.size, 19);
      });
    }).then(() => {
      return RNFS.unlink(f1).then(result => {
        this.assert('Unlink', result[0], true);
      });
    }).then(result => {
      return RNFS.readdir(RNFS.DocumentDirectoryPath).then(files => {
        this.assert('F1 Gone', files.indexOf('f1') === -1, true);
      });
    }).then(() => {
      this.assert('Tests Passed', true, true);
    }).catch(err => this.showError(err));
  },

  autoTest2: function() {
    var f1 = RNFS.DocumentDirectoryPath + '/f1';

    return Promise.resolve().then(() => {
      return RNFS.writeFile(f1, 'Zm9vIMKpIGJhciDwnYyGIGJheg==', 'base64').then(result => {
        this.assert('Write F1', result[0], true);
      });
    }).then(() => {
      return RNFS.readdir(RNFS.DocumentDirectoryPath).then(files => {
        this.assert('F1 Visible', files.indexOf('f1') !== -1, true);
      });
    }).then(() => {
      return RNFS.readFile(f1, 'base64').then(contents => {
        this.assert('Read F1', contents, 'Zm9vIMKpIGJhciDwnYyGIGJheg==');
      });
    }).then(() => {
      return RNFS.stat(f1).then(info => {
        this.assert('Stat', info.size, 19);
      });
    }).then(() => {
      return RNFS.unlink(f1).then(result => {
        this.assert('Unlink', result[0], true);
      });
    }).then(result => {
      return RNFS.readdir(RNFS.DocumentDirectoryPath).then(files => {
        this.assert('F1 Gone', files.indexOf('f1') === -1, true);
      });
    }).then(() => {
      this.assert('Tests Passed', true, true);
    }).catch(err => this.showError(err));
  },

  showError: function(err) {
    this.setState({ output: err.message });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.autoTest1}>
          <View style={styles.button}>
            <Text style={styles.text}>Test Read/Write/Delete 1</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.autoTest2}>
          <View style={styles.button}>
            <Text style={styles.text}>Test Read/Write/Delete 2</Text>
          </View>
        </TouchableHighlight>

        <View style={styles.button}>
          <Text style={styles.text}>---</Text>
        </View>

        <TouchableHighlight onPress={this.mkdirTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Make Dir</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.writeNestedTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Write Nested</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.readNestedTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Read Nested</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.readDirNestedTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Read Dir</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.deleteNestedTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Delete Nested</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.deleteDirTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Delete Dir</Text>
          </View>
        </TouchableHighlight>

        <View style={styles.button}>
          <Text style={styles.text}>---</Text>
        </View>

        <TouchableHighlight onPress={this.downloadFileTest}>
          <View style={styles.button}>
            <Text style={styles.text}>Download File</Text>
          </View>
        </TouchableHighlight>

        <Text style={styles.text}>{this.state.output}</Text>

        <Image style={styles.image} source={this.state.imagePath}></Image>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  button: {
    height: 32,
    backgroundColor: '#CCCCCC',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

AppRegistry.registerComponent('ReactNativeFSTest', () => RNFSApp);
