import logo from './logo.svg';
import './App.css';
import UploadFile from './UploadFile/UploadFile';

function App() {
  return (
    <div className='App'>
      <h1>Upload File</h1>
      <UploadFile
        onFinish={(files) => console.log('>>> fin', files)}
        multiple
      />
    </div>
  );
}

export default App;
