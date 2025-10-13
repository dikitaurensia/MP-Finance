import React, { useState } from "react";
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
} from "antd";
import "../../assets/base.scss";
const { Meta } = Card;
const { TextArea } = Input;
const { Paragraph, Text, Title } = Typography;

// --- Konten Default Template (Disesuaikan untuk 3 Jenis) ---
const initialHeader = `Dengan hormat bagian keuangan Mario Mutiara Palem,
Terima kasih atas kerjasama bisnis dengan anda.

Berikut adalah daftar faktur penjualan yang telah diterbitkan:
Faktur yang sudah/ akan jatuh tempo`;

const initialBody = `•   Tanggal : *04 Oct 2025*
1.⁠ ⁠Faktur penjualan BLIN-1025-0016 - Rp. 1.950.000

*Total Invoice: Rp. 1.950.000*
Pembayaran transfer ke Bank BCA: *BOSS LAKBAN INDONESIA, CV* Dengan no : *2118888028*

Terlampir link dokumen invoice dibawah ini:
https://pay.mitranpack.com/?q=Ym9zczo1NTQwMg==`;

const initialFooter = `Terima Kasih,
CV. Boss Lakban Indonesia`;

const defaultTemplates = [
  {
    id: "h-2",
    name: "Template H-2",
    description: "Pengingat pembayaran 2 hari sebelum jatuh tempo.",
    tagColor: "blue",
    header: initialHeader,
    body: initialBody.replace("*04 Oct 2025*", "*{{tanggal_2_hari_lagi}}*"),
    footer: initialFooter,
  },
  {
    id: "due-date",
    name: "Template Jatuh Tempo",
    description: "Pengingat pembayaran tepat pada hari jatuh tempo.",
    tagColor: "gold",
    header: initialHeader,
    body: initialBody.replace("*04 Oct 2025*", "*{{tanggal_jatuh_tempo}}*"),
    footer: initialFooter,
  },
  {
    id: "warning",
    name: "Template Peringatan",
    description: "Peringatan pembayaran untuk faktur yang sudah terlambat.",
    tagColor: "red",
    header: initialHeader.replace(
      "Terima kasih atas kerjasama bisnis dengan anda.",
      "Kami mengingatkan Anda terkait keterlambatan pembayaran."
    ),
    body: initialBody.replace(
      "*04 Oct 2025*",
      "*{{tanggal_jatuh_tempo_asli}}*"
    ),
    footer: initialFooter,
  },
];

const WhatsAppPreview = ({ message }) => {
  // Fungsi untuk memformat teks (Bold, Italic, Strikethrough, dan Enter)
  const formatMessage = (text) => {
    if (!text) return null;

    // 1. Memisahkan teks berdasarkan baris baru (\n)
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      let remainingText = line;
      const elements = [];
      let lastIndex = 0;

      // Regular Expression untuk menangkap SEMUA markup: *bold*, _italic_, ~strikethrough~
      const allMarkupRegex = /(\*|_|~)(.*?)\1/g;
      let match;

      // Process line to find markup
      while ((match = allMarkupRegex.exec(remainingText)) !== null) {
        const [fullMatch, delimiter, content] = match;

        // Add plain text before the markup
        if (match.index > lastIndex) {
          elements.push(
            <Text key={`text-pre-${lineIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </Text>
          );
        }

        // Determine styling based on delimiter
        let styleProps = {};
        if (delimiter === "*") {
          styleProps = { strong: true };
        } else if (delimiter === "_") {
          styleProps = { italic: true };
        } else if (delimiter === "~") {
          styleProps = { delete: true };
        }

        // Add the styled text element
        elements.push(
          <Text key={`styled-${lineIndex}-${match.index}`} {...styleProps}>
            {content}
          </Text>
        );

        lastIndex = match.index + fullMatch.length;
      }

      // Add remaining text after the last markup
      if (lastIndex < remainingText.length) {
        elements.push(
          <Text key={`text-end-${lineIndex}-${lastIndex}`}>
            {remainingText.substring(lastIndex)}
          </Text>
        );
      }

      // Return a div for one line. minHeight ensures empty lines appear as breaks.
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
          <WhatsAppOutlined style={{ color: "#25D366" }} /> Pratinjau Pesan
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
      borderLeft: "3px solid #16a34a",
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
  const [templates, setTemplates] = useState(defaultTemplates);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // State untuk menyimpan perubahan sementara di modal
  const [editorHeader, setEditorHeader] = useState("");
  const [editorBody, setEditorBody] = useState("");
  const [editorFooter, setEditorFooter] = useState("");

  // Handle pembukaan modal
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setEditorHeader(template.header);
    setEditorBody(template.body);
    setEditorFooter(template.footer);
    setIsModalVisible(true);
  };

  // Handle penyimpanan template dari modal
  const handleSave = () => {
    if (!selectedTemplate) return;

    // 1. Perbarui daftar templates
    const updatedTemplates = templates.map((t) =>
      t.id === selectedTemplate.id
        ? {
            ...t,
            header: editorHeader,
            body: editorBody,
            footer: editorFooter,
          }
        : t
    );
    setTemplates(updatedTemplates);

    // 2. Tutup modal
    setIsModalVisible(false);
    setSelectedTemplate(null);
  };

  // Gabungkan 3 bagian pesan untuk pratinjau modal
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
          {/* Grid untuk dua kolom */}
          <Row gutter={[24, 24]}>
            {/* Kolom untuk menampilkan 3 Kartu Template */}
            {templates.map((template) => (
              <Col key={template.id} span={24} lg={8}>
                <Card
                  title={
                    <Space direction="vertical" size={2}>
                      <Text strong>{template.name}</Text>
                      <Tag color={template.tagColor} style={{ marginTop: 4 }}>
                        {template.id.toUpperCase()}
                      </Tag>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    height: "100%", // Memastikan tinggi kartu sama
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

          {/* Modal Editor */}
          <Modal
            title={
              <Space>
                <EditOutlined /> Edit Template:{" "}
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
                  placeholder="Masukkan salam pembuka."
                  rows={10}
                />

                <EditorSection
                  title="2. Body"
                  value={editorBody}
                  onChange={(e) => setEditorBody(e.target.value)}
                  placeholder="Masukkan detail, variabel, dan informasi utama."
                  rows={5}
                  disabled={true}
                />

                <EditorSection
                  title="3. Footer"
                  value={editorFooter}
                  onChange={(e) => setEditorFooter(e.target.value)}
                  placeholder="Masukkan penutup, link dokumen, dan tanda tangan."
                  rows={5}
                />
              </Col>

              <Col span={24} md={12}>
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
