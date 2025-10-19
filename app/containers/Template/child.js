import React, { useEffect, useState } from "react";
import { EditOutlined, WhatsAppOutlined } from "@ant-design/icons";

import {
  PageHeader,
  Modal,
  Card,
  Row,
  Col,
  Input,
  Typography,
  Space,
  Tag,
  Button,
  List,
  Divider,
  Table,
} from "antd";
import "../../assets/base.scss";
import { getWhatsappTemplate, update } from "../../service/endPoint";
import { escapeRegExp, SuccessMessage } from "../../helper/publicFunction";
import { legends } from "../../helper/constanta";
const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const WhatsAppPreview = ({ message }) => {
  const formatMessage = (text) => {
    if (!text) return null;
    legends.forEach((x) => {
      const regex = new RegExp(escapeRegExp(x.name), "g");
      text = text.replace(regex, x.sample);
    });

    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      let remainingText = line;
      const elements = [];
      let lastIndex = 0;

      const allMarkupRegex = /(\*|_|~)(.*?)\1/g;
      let match;

      while ((match = allMarkupRegex.exec(remainingText)) !== null) {
        const [fullMatch, delimiter, content] = match;

        if (match.index > lastIndex) {
          elements.push(
            <Text key={`text-pre-${lineIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </Text>
          );
        }

        let styleProps = {};
        if (delimiter === "*") {
          styleProps = { strong: true };
        } else if (delimiter === "_") {
          styleProps = { italic: true };
        } else if (delimiter === "~") {
          styleProps = { delete: true };
        }

        elements.push(
          <Text key={`styled-${lineIndex}-${match.index}`} {...styleProps}>
            {content}
          </Text>
        );

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex < remainingText.length) {
        elements.push(
          <Text key={`text-end-${lineIndex}-${lastIndex}`}>
            {remainingText.substring(lastIndex)}
          </Text>
        );
      }

      return (
        <div
          key={`line-${lineIndex}`}
          style={{ minHeight: "1.4em", lineHeight: "1.4" }}
        >
          {elements}
        </div>
      );
    });
  };

  return (
    <Card
      title={
        <Space>
          <WhatsAppOutlined style={{ color: "#25D366" }} /> Preview
        </Space>
      }
      style={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#DCF8C6",
        borderRadius: 10,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #CFCFCF",
      }}
      bodyStyle={{ padding: "10px 14px" }}
    >
      {message ? (
        <div style={{ wordWrap: "break-word" }}>{formatMessage(message)}</div>
      ) : (
        <Text type="secondary">Ketik pesan Anda di editor...</Text>
      )}
    </Card>
  );
};

const EditorSection = ({
  title,
  value,
  onChange,
  placeholder,
  rows = 5,
  disabled = false,
}) => (
  <Card
    title={
      <Text strong style={{ fontSize: "1.05em" }}>
        {title}
      </Text>
    }
    bodyStyle={{ padding: 12 }}
    style={{
      marginBottom: 15,
      borderRadius: 6,
      // borderLeft: "3px solid #797979ff",
    }}
  >
    <TextArea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        minHeight: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: 4,
      }}
      disabled={disabled}
    />
  </Card>
);

const Template = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [editorHeader, setEditorHeader] = useState("");
  const [editorBody, setEditorBody] = useState("");
  const [editorFooter, setEditorFooter] = useState("");

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setEditorHeader(template.header);
    setEditorBody(template.body);
    setEditorFooter(template.footer);
    setIsModalVisible(true);
  };

  const getData = () => {
    let getData = getWhatsappTemplate("finance");
    getData
      .then((response) => {
        setTemplates(
          response.data.map((item, index) => ({
            ...item,
            tagColor: index == 0 ? "blue" : index == 1 ? "gold" : "red",
          }))
        );
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!selectedTemplate) return;

    await update("whatsapp_template", {
      id: selectedTemplate.id,
      header: editorHeader,
      footer: editorFooter,
    });

    SuccessMessage(`updated ${selectedTemplate.name}`);

    setIsModalVisible(false);
    setSelectedTemplate(null);
    getData();
  };

  const combinedMessage = [editorHeader, editorBody, editorFooter]
    .filter(Boolean)
    .join("\n\n");

  return (
    <React.Fragment>
      <section className="kanban__main">
        <section className="kanban__nav">
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="Template Message"
          />
        </section>

        <div className="kanban__main-wrapper">
          <Row gutter={[24, 24]}>
            {templates.map((template) => (
              <Col key={template.id} span={24} lg={8}>
                <Card
                  title={
                    <Space direction="vertical" size={2}>
                      <Text strong>{template.name}</Text>
                      <Tag color={template.tagColor} style={{ marginTop: 4 }}>
                        {template.tag.toUpperCase()}
                      </Tag>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    height: "100%",
                  }}
                  actions={[
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(template)}
                      style={{
                        width: "90%",
                        borderRadius: 6,
                        fontWeight: "bold",
                      }}
                    >
                      Edit Template
                    </Button>,
                  ]}
                  bodyStyle={{
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    padding: 16,
                  }}
                >
                  <Paragraph style={{ margin: 0 }}>
                    {template.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal
            title={
              <Space>
                <EditOutlined /> Edit Template:
                {selectedTemplate ? selectedTemplate.name : ""}
              </Space>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleSave}
            width={"80%"}
            style={{ top: 20 }}
            okText="Simpan Perubahan"
            cancelText="Batal"
          >
            <Row gutter={[24, 24]}>
              <Col span={24} md={12}>
                <EditorSection
                  title="1. Header"
                  value={editorHeader}
                  onChange={(e) => setEditorHeader(e.target.value)}
                  placeholder="header"
                  rows={10}
                />

                <EditorSection
                  title="2. Body"
                  value={editorBody}
                  onChange={(e) => setEditorBody(e.target.value)}
                  placeholder="body"
                  rows={5}
                  disabled={true}
                />

                <EditorSection
                  title="3. Footer"
                  value={editorFooter}
                  onChange={(e) => setEditorFooter(e.target.value)}
                  placeholder="footer"
                  rows={5}
                />
              </Col>

              <Col span={24} md={12}>
                <Table
                  size="small"
                  columns={[
                    {
                      title: "Variable",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Example",
                      dataIndex: "sample",
                      key: "sample",
                    },
                  ]}
                  dataSource={legends}
                  style={{
                    marginBottom: "16px",
                    borderRadius: 6,
                    // borderLeft: "3px solid #797979ff",
                  }}
                  pagination={false}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 20,
                  }}
                >
                  <WhatsAppPreview message={combinedMessage} />
                </div>
              </Col>
            </Row>
          </Modal>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Template;
