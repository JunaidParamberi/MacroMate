import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const formattingStyles = StyleSheet.create({
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
  },
  messagePlain: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageBold: {
    fontWeight: '700',
  },
  messageItalic: {
    fontStyle: 'italic',
  },
  messageMono: {
    fontFamily: 'Menlo',
    fontSize: 14,
  },
  messageParagraphSpacer: {
    height: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  bulletSymbol: {
    fontWeight: '700',
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 12,
    marginBottom: 6,
  },
  quoteBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
    marginRight: 8,
  },
  quoteText: {
    fontStyle: 'italic',
    opacity: 0.9,
  },
});

const renderInlineSegments = (line: string) => {
  const segments = line
    .split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g)
    .filter(Boolean);

  return segments.map((segment, index) => {
    if ((segment.startsWith('**') && segment.endsWith('**')) || (segment.startsWith('__') && segment.endsWith('__'))) {
      return (
        <Text key={`bold-${index}`} style={formattingStyles.messageBold}>
          {segment.slice(2, -2)}
        </Text>
      );
    }

    if ((segment.startsWith('*') && segment.endsWith('*')) || (segment.startsWith('_') && segment.endsWith('_'))) {
      return (
        <Text key={`italic-${index}`} style={formattingStyles.messageItalic}>
          {segment.slice(1, -1)}
        </Text>
      );
    }

    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <Text key={`mono-${index}`} style={formattingStyles.messageMono}>
          {segment.slice(1, -1)}
        </Text>
      );
    }

    return (
      <Text key={`plain-${index}`} style={formattingStyles.messagePlain}>
        {segment}
      </Text>
    );
  });
};

export const renderFormattedContent = (content: string, color: string) => {
  if (!content.trim()) {
    return null;
  }

  return content.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <View key={`space-${index}`} style={formattingStyles.messageParagraphSpacer} />;
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const text = trimmed.replace(/^[-•]\s*/, '');
      return (
        <View key={`bullet-${index}`} style={formattingStyles.bulletRow}>
          <Text style={[formattingStyles.bulletSymbol, { color }]}>•</Text>
          <Text style={[formattingStyles.messageText, { color }]}>{renderInlineSegments(text)}</Text>
        </View>
      );
    }

    if (trimmed.startsWith('>')) {
      const text = trimmed.replace(/^>\s*/, '');
      return (
        <View key={`quote-${index}`} style={formattingStyles.quoteRow}>
          <View style={[formattingStyles.quoteBar, { backgroundColor: `${color}30` }]} />
          <Text style={[formattingStyles.messageText, formattingStyles.quoteText, { color }]}>{renderInlineSegments(text)}</Text>
        </View>
      );
    }

    return (
      <Text key={`line-${index}`} style={[formattingStyles.messageText, { color }]}>
        {renderInlineSegments(trimmed)}
      </Text>
    );
  });
};

export const normalizeAssistantContent = (value: string) =>
  value
    .replace(/\r/g, '')
    .replace(/\t/g, '  ')
    .replace(/^\s*[-•]\s+/gm, '• ')
    .trim();
