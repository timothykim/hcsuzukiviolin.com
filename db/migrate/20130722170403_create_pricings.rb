class CreatePricings < ActiveRecord::Migration
  def self.up
    create_table :pricings do |t|
      t.column :session_id, :integer
      t.column :pricing_type, :string
      t.column :duration, :integer
      t.column :price, :integer
      t.timestamps
    end
  end

  def self.down
    drop_table :pricings
  end
end
