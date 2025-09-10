import React, { useEffect, useState } from "react";
import "al-styles/portfolio.scss";
import "al-styles/base-portfolio.scss";
import "al-styles/bootstrap.min.scss";
import { List, Card } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { ErrorMessage, search, SuccessMessage } from '../../helper/publicFunction'
import BannerAccurate from "../../assets/img/banner-accurate.jpg";
import { create } from "../../service/endPoint";

const { Meta } = Card;
import "antd/dist/antd.css";
import { openDBAccurate, listDBAccurate } from "../../service/endPoint"


export const index = (props) => {
  const [token, setToken] = useState("")
  const [db, setDb] = useState([]);

  const getData = (token) => {
    const listData = listDBAccurate(token)
    listData
      .then((ress) => {
        setDb(ress.d)
      })
      .catch((error) => {
        console.log("Berhasil notif checker");
      });
  };

  const handleSave = (body) => {
    const getData = create("accurate", body)
    getData
      .then((response) => {
        SuccessMessage(response.status);
        window.location.href = "/app/accurate";
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  const chooseDB = (id) => {
    const opendb = openDBAccurate(token, id)
    opendb
      .then((ress) => {
        const database = search("id", id, db);
        const body = {
          dbname: database.alias,
          token,
          session: ress.session,
          host: ress.host
        }
        handleSave(body)
        console.log(JSON.stringify(ress))
      })
      .catch((error) => {
        console.log("Berhasil notif checker");
      });

  }

  useEffect(() => {
    const search = window.location.hash.replace("#", "?");
    const params = new URLSearchParams(search);
    const access_token = params.get('access_token');
    setToken(access_token)
    getData(access_token);
  }, []);


  return (
    <div className="container">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3
        }}
        dataSource={db}
        renderItem={db => (
          <List.Item>
            <Card
              cover={
                <img
                  alt="example"
                  src={BannerAccurate}
                />
              }
              actions={[
                <ShareAltOutlined onClick={() => chooseDB(db.id)} />,
              ]}
            >
              <Meta
                title={db.alias}
                description={`Active until: ${db.accessibleUntil}`}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default index;
