import React, { Component } from "react";
import { Modal, Image, Button, Input } from "antd";

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alt: "",
      src: "",
      newFile: false,
      file: null,
      canDelete: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSimpan = this.handleSimpan.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { visible, alt, src, canDelete } = this.props;
    if (prevProps.visible !== visible && visible) {
      this.setState({ alt, src, newFile: false, file: null, canDelete });
    }
  }

  handleChange(event) {
    this.setState({
      src: URL.createObjectURL(event.target.files[0]),
      newFile: true,
      file: event.target.files[0],
    });
  }

  handleSimpan() {
    let { alt, file } = this.state;
    this.props.onOK(file, alt);
  }

  render() {
    const { onCancel, visible, deleteImage, mode } = this.props;
    let { src, alt, newFile, canDelete } = this.state;
    return (
      <Modal
        title={alt}
        onCancel={onCancel}
        onOk={this.handleSimpan}
        visible={visible}
        footer={[
          <Button
            type="ghost"
            onClick={() => deleteImage(src, alt)}
            disabled={!canDelete || mode !== "manager"}
          >
            Hapus Foto
          </Button>,
          <Button
            type="primary"
            onClick={this.handleSimpan}
            disabled={!newFile || mode !== "manager"}
          >
            Simpan
          </Button>,
          <Button key="back" onClick={onCancel}>
            Tutup
          </Button>,
        ]}
      >
        <div>
          <Image alt={alt} src={src} />
          <hr />
          Ambil Foto:
          <Input
            disabled={mode !== "manager"}
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={this.handleChange}
          />
        </div>
      </Modal>
    );
  }
}
