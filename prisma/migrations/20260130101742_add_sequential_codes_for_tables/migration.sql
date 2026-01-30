-- AlterTable
ALTER TABLE "InboundTransaction" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OutboundTransaction" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockBatch" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "code" DROP NOT NULL;

-- ============================================
-- STOCK BATCH SEQUENTIAL CODES
-- ============================================

-- Create sequence for stock batches
CREATE SEQUENCE stock_batch_code_seq START 1;


-- Create function to generate stock batch codes
CREATE OR REPLACE FUNCTION generate_stock_batch_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'BATCH-' || LPAD(nextval('stock_batch_code_seq')::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_stock_batch_code ON "StockBatch";
CREATE TRIGGER set_stock_batch_code
BEFORE INSERT ON "StockBatch"
FOR EACH ROW
EXECUTE FUNCTION generate_stock_batch_code();


-- ============================================
-- INBOUND TRANSACTION SEQUENTIAL CODES
-- ============================================

-- Create sequence for inbound transactions
CREATE SEQUENCE inbound_transaction_code_seq START 1;


-- Create function to generate inbound transaction codes
CREATE OR REPLACE FUNCTION generate_inbound_transaction_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'IN-' || LPAD(nextval('inbound_transaction_code_seq')::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_inbound_transaction_code ON "InboundTransaction";
CREATE TRIGGER set_inbound_transaction_code
BEFORE INSERT ON "InboundTransaction"
FOR EACH ROW
EXECUTE FUNCTION generate_inbound_transaction_code();



-- ============================================
-- ORDER SEQUENTIAL CODES
-- ============================================

-- Create sequence for orders
CREATE SEQUENCE order_code_seq START 1;


-- Create function to generate order codes
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'ORD-' || LPAD(nextval('order_code_seq')::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_order_code ON "Order";
CREATE TRIGGER set_order_code
BEFORE INSERT ON "Order"
FOR EACH ROW
EXECUTE FUNCTION generate_order_code();


-- ============================================
-- OUTBOUND TRANSACTION SEQUENTIAL CODES
-- ============================================

-- Create sequence for outbound transactions
CREATE SEQUENCE outbound_transaction_code_seq START 1;


-- Create function to generate outbound transaction codes
CREATE OR REPLACE FUNCTION generate_outbound_transaction_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'OUT-' || LPAD(nextval('outbound_transaction_code_seq')::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_outbound_transaction_code ON "OutboundTransaction";
CREATE TRIGGER set_outbound_transaction_code
BEFORE INSERT ON "OutboundTransaction"
FOR EACH ROW
EXECUTE FUNCTION generate_outbound_transaction_code();