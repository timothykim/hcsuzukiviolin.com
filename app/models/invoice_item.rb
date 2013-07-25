class InvoiceItem < ActiveRecord::Base
  belongs_to :invoice

  def total
    self.unit_price * self.quantity
  end

  def unit_price_in_dollar
    p = self.unit_price
    (p.to_f / 100).to_s + (p % 10 == 0 ? "0" : "")
  end
end
