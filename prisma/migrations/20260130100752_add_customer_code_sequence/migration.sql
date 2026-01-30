-- Create a sequence for customer codes
CREATE SEQUENCE customer_code_seq START 1;


-- Create a function to generate customer codes
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'CUST-' || LPAD(nextval('customer_code_seq')::TEXT, 8, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-generate codes
CREATE TRIGGER set_customer_code
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION generate_customer_code();
