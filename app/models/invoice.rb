class Invoice < ActiveRecord::Base
  belongs_to :registration
  has_many :invoice_items, :order => "created_at ASC", :dependent => :destroy

  def total
    total = 0
    self.invoice_items.each do |item| 
      total += item.total
    end
    total
  end
end
