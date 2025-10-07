import React, { useState, useEffect, useRef } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

import {
  PageHeader,
  Modal,
  Card,
  Row,
  Col,
  Avatar,
  Layout,
  Input,
  Typography,
  Space,
} from "antd";
import "../../assets/base.scss";
const { Meta } = Card;

const desc = `Dengan hormat bagian keuangan Mario Mutiara Palem,

Terima kasih atas kerjasama bisnis dengan anda.

Berikut adalah daftar faktur penjualan yang telah diterbitkan:

Faktur yang sudah/ akan jatuh tempo
•   Tanggal : *04 Oct 2025*
1.⁠ ⁠Faktur penjualan BLIN-1025-0016 - Rp. 1.950.000

*Total Invoice: Rp. 1.950.000*

Pembayaran transfer ke Bank BCA: *BOSS LAKBAN INDONESIA, CV* Dengan no : *2118888028*

Terlampir link dokumen invoice dibawah ini:

https://pay.mitranpack.com/?q=Ym9zczo1NTQwMg==

Terima Kasih,
CV. Boss Lakban Indonesia`;

const { Content } = Layout;
const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

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
      // Gabungkan semua pola menjadi satu RegEx
      const allMarkupRegex = /(\*|_|~)(.*?)\1/g;

      let match;

      // Proses per baris untuk menemukan markup
      while ((match = allMarkupRegex.exec(remainingText)) !== null) {
        const [fullMatch, delimiter, content] = match;

        // Tambahkan teks biasa sebelum markup
        if (match.index > lastIndex) {
          elements.push(
            <Text key={`text-pre-${lineIndex}-${lastIndex}`}>
              {remainingText.substring(lastIndex, match.index)}
            </Text>
          );
        }

        // Tentukan styling berdasarkan delimiter
        let styleProps = {};
        if (delimiter === "*") {
          // Bold
          styleProps = { strong: true };
        } else if (delimiter === "_") {
          // Italic
          styleProps = { italic: true };
        } else if (delimiter === "~") {
          // Strikethrough
          styleProps = { delete: true };
        }

        // Tambahkan elemen teks dengan styling yang sesuai
        elements.push(
          <Text key={`styled-${lineIndex}-${match.index}`} {...styleProps}>
            {content}
          </Text>
        );

        lastIndex = match.index + fullMatch.length;
      }

      // Tambahkan sisa teks setelah markup terakhir
      if (lastIndex < remainingText.length) {
        elements.push(
          <Text key={`text-end-${lineIndex}-${lastIndex}`}>
            {remainingText.substring(lastIndex)}
          </Text>
        );
      }

      // Mengembalikan elemen div untuk satu baris.
      // minHeight memastikan baris kosong terlihat sebagai enter.
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

const Template = () => {
  const [template, setTemplate] = useState(desc);

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
          <Row gutter={[24, 24]} style={{ flex: 1 }}>
            {/* Kolom Kiri: Editor */}
            <Col span={24} md={12}>
              <Card title="✍️ Editor Template 1">
                <TextArea
                  rows={15}
                  placeholder="Type your message template here.
Use *text* for bold, _text_ for italic, ~text~ for strikethrough."
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={{ minHeight: 300 }}
                />
                <Paragraph type="secondary" style={{ marginTop: 10 }}>
                  *teks* = <span style={{ fontWeight: "bold" }}>Bold</span>,
                  _teks_ = <span style={{ fontStyle: "italic" }}>Italic</span>,
                  ~teks~ = <del>Strikethrough</del>
                </Paragraph>
              </Card>
            </Col>

            {/* Kolom Kanan: Pratinjau */}
            <Col span={24} md={12}>
              <Card title="📱 Preview">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: "100%",
                  }}
                >
                  <WhatsAppPreview message={template} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Catatan: Komponen Content di antd biasanya ada di dalam Layout, 
          tapi di sini kita gunakan Layout sebagai container utama. */}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 40px",
              border: "6px solid #16a34a",
              borderRadius: "8px",
              opacity: 0.3,
              transform: "rotate(-20deg)",
            }}
          >
            <div
              style={{
                color: "#16a34a",
                fontSize: "3.75rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              COMING SOON
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Template;
