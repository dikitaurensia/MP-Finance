import React from "react";
import { PageHeader, Button } from "antd";
// import PageHeader from "antd/lib/page-header";
// import Button from "antd/lib/Button";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Input,
} from "@material-ui/core";
import { ThreeSixtySharp } from "@material-ui/icons";
import { me, updatePassword } from "../../service/endPoint";
import { ErrorMessage, SuccessMessage } from "../../helper/publicFunction";
class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpassword: "",
      newpassword: "",
      repassword: "",
    };
    this.onChange = this.onChange.bind(this);
    this.handleSave = this.handleSave.bind(ThreeSixtySharp);
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSave = (e) => {
    e.preventDefault();

    let getID = me();
    getID
      .then((ress) => {
        let { oldpassword, newpassword, repassword } = this.state;
        if (oldpassword === "" || newpassword === "" || repassword === "") {
          return;
        }

        if (newpassword !== repassword) {
          ErrorMessage({ message: "Password tidak sama" });
        }

        let getData = updatePassword({ ...this.state, id: ress.data.id });
        getData
          .then((response) => {
            SuccessMessage(response.status);
          })
          .catch((error) => {
            ErrorMessage(error);
          });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  render() {
    let { oldpassword, newpassword, repassword } = this.state;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 12 },
    };
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Settings"
            />
            <div className="kanban__nav-wrapper" />
          </section>

          <div className="kanban__main-wrapper">
            <div className="setting-password">
              <form autoComplete="off" className="form">
                <FormControl>
                  <InputLabel htmlFor="component-helper">
                    Password saat ini
                  </InputLabel>
                  <Input
                    id="component-helper"
                    aria-describedby="component-helper-text"
                    value={oldpassword}
                    name="oldpassword"
                    onChange={this.onChange}
                    type="password"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-helper">
                    Password baru
                  </InputLabel>
                  <Input
                    id="component-helper"
                    aria-describedby="component-helper-text"
                    value={newpassword}
                    name="newpassword"
                    onChange={this.onChange}
                    type="password"
                  />
                  <FormHelperText id="component-helper-text">
                    Minimal 6 karakter
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-helper">
                    Ulangi password baru
                  </InputLabel>
                  <Input
                    id="component-helper"
                    aria-describedby="component-helper-text"
                    value={repassword}
                    name="repassword"
                    onChange={this.onChange}
                    type="password"
                  />
                  <FormHelperText id="component-helper-text">
                    Masukkan kembali password baru
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <Button
                    type="primary"
                    shape="round"
                    className="btn-change-password"
                    onClick={this.handleSave}
                  >
                    Ganti password
                  </Button>
                </FormControl>
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
