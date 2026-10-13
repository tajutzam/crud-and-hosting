<?php

namespace App\Repositories;

use App\Models\OrderItem;

class OrderItemRepository
{
    public function createMany(array $items)
    {
        $createdItems = [];

        foreach ($items as $item) {
            $createdItems[] = OrderItem::create($item);
        }

        return collect($createdItems);
    }
}

