import { useEffect, useMemo, useState } from 'react';
import { ProductAttribute, StockRecord } from '../../../../API';

export enum AttributeName {
  Color = 'Color',
  Dimensions = 'Dimensions',
}

export interface AttributeOption {
  name: AttributeName;
  value: string;
  relatedAttributes: AttributeOption[];
  stockRecord: StockRecord;
}

export interface SelectedAttributes {
  color?: AttributeOption;
  dimensions?: AttributeOption;
}

interface Props {
  stockRecord?: StockRecord;
}

// WHY ? Because Arabic content is served for English settings
const isColorAttribute = (attr: ProductAttribute) => {
  return attr.name === 'Color' || attr.name === 'اللون';
};
const isDimensionsAttribute = (attr: ProductAttribute) => {
  return attr.name === 'Dimensions' || attr.name === 'الأبعاد';
};

/**
 *        _ Color _
 *       /    |    \
 *     Attr  Attr  Attr
 * -----------------------
 */
const extractProductAttributes = (attributes: ProductAttribute[], stockRecord: StockRecord): AttributeOption => {
  const productAttributes: AttributeOption = {
    name: AttributeName.Color,
    value: '',
    relatedAttributes: [],
    stockRecord,
  };

  for (const attr of attributes) {
    // handle optional attrs.
    if (isColorAttribute(attr)) {
      productAttributes.value = attr.value || '';
    } else if (isDimensionsAttribute(attr)) {
      productAttributes.relatedAttributes.push({
        name: AttributeName.Dimensions,
        value: attr.value || '',
        relatedAttributes: [],
        stockRecord,
      });
    } else {
      console.warn(`Unknown attribute type: ${attr.name}`);
    }
  }

  return productAttributes;
};

const matchSelectedAttributes = (
  attributes: AttributeOption[],
  color: string,
  dimensions: string
): SelectedAttributes => {
  let colorAttribute;
  let dimensionsAttribute;
  for (const attr of attributes) {
    if (attr.value === color) {
      colorAttribute = attr;
      for (const dimAttr of attr.relatedAttributes) {
        if (dimAttr.value === dimensions) {
          dimensionsAttribute = dimAttr;
        }
      }
    }
  }
  return {
    color: colorAttribute,
    dimensions: dimensionsAttribute,
  };
};

export const useProductAttributes = ({ stockRecord }: Props) => {
  const [selectedAttribute, setSelectedAttribute] = useState<SelectedAttributes>();

  const productAttributes: AttributeOption[] = useMemo(() => {
    if (!stockRecord?.product?.attributes) {
      return [];
    }
    return [extractProductAttributes(stockRecord.product.attributes as ProductAttribute[], stockRecord)];
  }, [stockRecord?.product?.attributes]);

  const vendorVariantsAttributes: AttributeOption[] = useMemo(() => {
    if (!stockRecord?.vendor_variants) {
      return [];
    }
    const _vendorVariantsAttributes: AttributeOption[] = [];
    for (const variant of stockRecord.vendor_variants) {
      if (variant?.product?.attributes) {
        const attribute = extractProductAttributes(variant.product.attributes as ProductAttribute[], variant);
        _vendorVariantsAttributes.push(attribute);
      }
    }
    return _vendorVariantsAttributes;
  }, [stockRecord?.vendor_variants]);

  const attributes: AttributeOption[] = useMemo(() => {
    const _attributesMap = new Map<string, AttributeOption>();
    const _allAttributes = [...productAttributes, ...vendorVariantsAttributes];
    for (const attribute of _allAttributes) {
      if (_attributesMap.has(attribute.value)) {
        const currentAttribute = _attributesMap.get(attribute.value) as AttributeOption;
        const relatedAttributes = [];
        const relatedAttributesSet = new Set();
        for (const attr of [...currentAttribute.relatedAttributes, ...attribute.relatedAttributes]) {
          if (relatedAttributesSet.has(attr.value) === false) {
            relatedAttributes.push(attr);
            relatedAttributesSet.add(attr.value);
          }
        }
        _attributesMap.set(attribute.value, { ...currentAttribute, relatedAttributes });
      } else {
        _attributesMap.set(attribute.value, attribute);
      }
    }
    return Array.from(_attributesMap, ([_, value]) => value);
  }, [productAttributes, vendorVariantsAttributes]);

  useEffect(() => {
    const [color, dimensions] = stockRecord?.product?.attributes || [];
    if (color && dimensions) {
      if (color?.value && dimensions?.value) {
        const initialAttributes = matchSelectedAttributes(attributes, color.value, dimensions.value);
        setSelectedAttribute(initialAttributes);
      }
    }
  }, [attributes]);

  const colorAttributes = useMemo(() => {
    return attributes.map((attribute) => attribute.value);
  }, [attributes]);

  const dimensionsAttributes = useMemo(() => {
    return attributes.flatMap((attribute) => attribute.relatedAttributes.map((related) => related.value));
  }, [attributes]);

  return { attributes, selectedAttribute, setSelectedAttribute, colorAttributes, dimensionsAttributes };
};
